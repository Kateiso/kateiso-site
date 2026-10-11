"""Bounded, free public HTTP integrity checks. Never executes downloaded content."""
import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path
import re
import urllib.request

parser = argparse.ArgumentParser()
parser.add_argument('--weekly', action='store_true')
parser.add_argument('--final-report', action='store_true')
parser.add_argument('--output', default='D:/user2/logs/kateiso-site')
args = parser.parse_args()
out = Path(args.output)
out.mkdir(parents=True, exist_ok=True)
now = dt.datetime.now(dt.timezone(dt.timedelta(hours=8)))
end = dt.datetime(2027, 1, 10, tzinfo=now.tzinfo)
if now >= end:
    (out / 'completed.json').write_text(json.dumps({'ended': now.isoformat(), 'status': 'monitoring ended; ranking outcome requires recorded platform evidence'}, indent=2), encoding='utf-8')
    if args.final_report:
        (out / 'outcome-90-days.json').write_text(json.dumps({'closed_at': now.isoformat(), 'status': 'End report ran after deadline; no new network requests made', 'evidence': 'See latest.json and weekly reports', 'ranking': 'Not established by integrity checks'}, indent=2), encoding='utf-8')
    raise SystemExit(0)

checks = []
for route in ['/', '/en/index.html', '/robots.txt', '/sitemap-index.xml']:
    item = {'url': 'https://kateiso.dev' + route}
    try:
        req = urllib.request.Request(item['url'], headers={'User-Agent': 'KateisoSiteIntegrity/1.0 (+https://kateiso.dev)'})
        with urllib.request.urlopen(req, timeout=25) as response:
            data = response.read(2_000_001)
            text = data.decode('utf-8', errors='replace')
            item.update(status=response.status, final_url=response.url, bytes=len(data), sha256=hashlib.sha256(data).hexdigest())
            if len(data) > 2_000_000:
                raise ValueError('response exceeds integrity-check size limit')
            match = re.search(r'<title[^>]*>(.*?)</title>', text, re.S | re.I)
            item['title'] = re.sub(r'\s+', ' ', match.group(1))[:200] if match else None
            if route.endswith('.html') or route == '/':
                item['healthy'] = ('Kateiso Cao' in text and 'https://kateiso.dev/#person' in text and not re.search(r'PAJEROTOTO|Anti Rungkad', text, re.I))
            elif route == '/robots.txt':
                item['healthy'] = 'Sitemap: https://kateiso.dev/sitemap-index.xml' in text and not re.search(r'Disallow:\s*/\s*(?:\n|$)', text)
            else:
                item['healthy'] = '<sitemapindex' in text and 'https://kateiso.dev/' in text
    except Exception as exc:
        item.update(healthy=False, error=f'{type(exc).__name__}: {exc}'[:250])
    checks.append(item)

result = {'checked_at': now.isoformat(), 'healthy': all(c['healthy'] for c in checks), 'checks': checks,
          'network_scope': 'user2 host connection; China direct routing is not established'}
state = out / 'latest.json'
previous = json.loads(state.read_text(encoding='utf-8')) if state.exists() else {}
def signal(report):
    return [(c['url'], c.get('status'), c['healthy'], c.get('title'), c.get('error')) for c in report.get('checks', [])]
changed = signal(previous) != signal(result)
state.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
with (out / 'history.jsonl').open('a', encoding='utf-8') as f:
    f.write(json.dumps(result, ensure_ascii=False) + '\n')
if changed:
    with (out / 'alerts.jsonl').open('a', encoding='utf-8') as f:
        f.write(json.dumps({'at': now.isoformat(), 'state': 'recovered' if result['healthy'] else 'action_required', 'checks': checks}, ensure_ascii=False) + '\n')
    print('Recovered' if result['healthy'] else 'Action required: see ' + str(state))
if args.weekly:
    week = now.strftime('%Y-%m-%d')
    report = {'date': week, 'queries': ['曹益波', 'Kateiso Cao', 'Yibo Cao', 'Kateio'],
              'platforms': {p: {'status': 'NOT TESTED', 'reason': 'Requires independent fresh search session and authenticated browser where applicable; no paid API configured'} for p in ['Google', 'ChatGPT', 'Gemini', 'Doubao', 'Codex']},
              'required_fields': ['query', 'locale', 'date', 'browsing_mode', 'result_order', 'cited_urls', 'identity_correctness'],
              'site_healthy': result['healthy']}
    target = out / ('weekly-' + week + '.json')
    if not target.exists():
        target.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print('Weekly review due: ' + str(target))
if args.final_report:
    reports = sorted(out.glob('weekly-*.json'))
    summary = {'closed_at': now.isoformat(), 'site_healthy': result['healthy'],
               'weekly_reports': [p.name for p in reports],
               'outcome': 'Monitoring period complete. Rankings are not proven by HTTP checks.',
               'remaining_gaps': ['Review platform reports for actual ranking evidence', 'Resolve any unhealthy site checks', 'Public profile and indexing changes require authenticated access']}
    (out / 'outcome-90-days.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
    print('90-day outcome report: ' + str(out / 'outcome-90-days.json'))
