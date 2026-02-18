(function () {
  initNav();
  initYear();
  initKaiDrawer();
  initMomentsPreview();
  initPhotoLikeEffects();

  function initNav() {
    const nav = document.querySelector('[data-js="nav"]');
    if (!nav) return;

    const toggle = nav.querySelector('.site-nav__toggle');
    const menu = nav.querySelector('.site-nav__list');

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        menu.classList.toggle('is-open', !isOpen);
      });

      menu.addEventListener('click', (event) => {
        if (event.target instanceof HTMLAnchorElement) {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('is-open');
        }
      });
    }
  }

  function initYear() {
    document.querySelectorAll('[data-js="year"]').forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function initKaiDrawer() {
    const toggle = document.querySelector('[data-js="kai-toggle"]');
    const drawer = document.querySelector('[data-js="kai-drawer"]');
    const closeBtn = document.querySelector('[data-js="kai-close"]');
    const form = document.querySelector('[data-js="kai-form"]');
    const messages = document.querySelector('[data-js="kai-messages"]');
    const providerSelect = document.querySelector('[data-js="kai-provider"]');

    if (!(toggle instanceof HTMLButtonElement) || !(drawer instanceof HTMLElement)) return;
    if (!(form instanceof HTMLFormElement) || !(messages instanceof HTMLElement)) return;

    const input = form.querySelector('textarea[name="prompt"]');
    const sendBtn = form.querySelector('[data-js="kai-send"]');
    if (!(input instanceof HTMLTextAreaElement) || !(sendBtn instanceof HTMLButtonElement)) return;

    const apiBase = (document.body.dataset.chatApi || '').trim().replace(/\/$/, '');
    const defaultProvider = (document.body.dataset.chatProvider || 'gemini').toLowerCase();
    const personaId = document.body.dataset.chatPersona || 'kai-v1';

    if (providerSelect instanceof HTMLSelectElement) {
      providerSelect.value = defaultProvider === 'anthropic' ? 'anthropic' : 'gemini';
    }

    const fallbackReply = document.documentElement.lang.startsWith('en')
      ? 'Gateway is not connected yet. Set PUBLIC_CHAT_API_BASE to enable live model responses.'
      : '聊天网关还未配置。设置 PUBLIC_CHAT_API_BASE 后即可连接真实模型。';

    const errorReply = document.documentElement.lang.startsWith('en')
      ? 'Sorry, Kai is temporarily unavailable. Please try again in a moment.'
      : '抱歉，Kai 暂时不可用，请稍后再试。';

    const modelMap = {
      anthropic: 'claude-3-5-sonnet-20241022',
      gemini: 'gemini-1.5-pro',
    };

    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      if (event.shiftKey || event.isComposing) return;
      event.preventDefault();
      form.requestSubmit();
    });

    const openDrawer = () => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('chat-open');
      setTimeout(() => input.focus(), 20);
    };

    const closeDrawer = () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('chat-open');
    };

    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('is-open');
      if (isOpen) closeDrawer();
      else openDrawer();
    });

    closeBtn?.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    function pushMessage(role, text) {
      const article = document.createElement('article');
      article.className = `kai-msg ${role === 'user' ? 'kai-msg--user' : 'kai-msg--assistant'}`;
      const p = document.createElement('p');
      p.textContent = text;
      article.appendChild(p);
      messages.appendChild(article);
      messages.scrollTop = messages.scrollHeight;
      return p;
    }

    async function streamReply(payload, targetNode) {
      if (!apiBase) {
        targetNode.textContent = fallbackReply;
        return;
      }

      const response = await fetch(`${apiBase}/v1/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const fallback = await fetch(`${apiBase}/v1/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, stream: false }),
        });
        if (!fallback.ok) {
          throw new Error(`chat_failed_${response.status}`);
        }
        const data = await fallback.json();
        targetNode.textContent = data?.text || errorReply;
        return;
      }

      if (!response.body) {
        targetNode.textContent = errorReply;
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let combined = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        events.forEach((eventChunk) => {
          const line = eventChunk
            .split('\n')
            .find((lineText) => lineText.startsWith('data: '));
          if (!line) return;

          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.type === 'token') {
              combined += payload.text || '';
              targetNode.textContent = combined;
              messages.scrollTop = messages.scrollHeight;
            }
            if (payload.type === 'error') {
              throw new Error(payload.text || 'provider_error');
            }
          } catch (error) {
            throw error;
          }
        });
      }

      if (!combined.trim()) {
        targetNode.textContent = errorReply;
      }
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const prompt = input.value.trim();
      if (!prompt) return;

      if (!drawer.classList.contains('is-open')) {
        openDrawer();
      }

      const provider = providerSelect instanceof HTMLSelectElement ? providerSelect.value : defaultProvider;

      pushMessage('user', prompt);
      const assistantNode = pushMessage('assistant', document.documentElement.lang.startsWith('en') ? 'Kai is thinking...' : 'Kai 正在思考...');

      sendBtn.disabled = true;
      input.disabled = true;

      const payload = {
        provider,
        model: modelMap[provider] || modelMap.gemini,
        personaId,
        stream: true,
        messages: [{ role: 'user', content: prompt }],
      };

      try {
        await streamReply(payload, assistantNode);
      } catch {
        assistantNode.textContent = errorReply;
      } finally {
        sendBtn.disabled = false;
        input.disabled = false;
        input.value = '';
        input.focus();
      }
    });
  }

  function initMomentsPreview() {
    document.querySelectorAll('.moments-rail__item video').forEach((video) => {
      if (!(video instanceof HTMLVideoElement)) return;

      const play = () => {
        video.muted = true;
        video.play().catch(() => undefined);
      };
      const pause = () => {
        video.pause();
        video.currentTime = 0;
      };

      video.addEventListener('mouseenter', play);
      video.addEventListener('mouseleave', pause);
      video.addEventListener('touchstart', play, { passive: true });
      video.addEventListener('touchend', pause, { passive: true });
    });
  }

  function initPhotoLikeEffects() {
    document.querySelectorAll('.photo-stream__action--like').forEach((btn) => {
      if (!(btn instanceof HTMLButtonElement)) return;

      btn.addEventListener('click', () => {
        btn.classList.add('is-active');
        window.setTimeout(() => btn.classList.remove('is-active'), 520);
      });
    });
  }
})();
