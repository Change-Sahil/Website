# -*- coding: utf-8 -*-
"""Temporaer: echter Mailversand an das Postfach des Auftraggebers.

Loest beide Mails aus, die ein Nutzer bekommen kann:
  1. Persoenlicher Ergebnis- und Arbeitsbericht
  2. Benachrichtigung ueber eine neue Einschaetzung im Perspektivvergleich

Zusaetzlich geht die interne Benachrichtigung an CONTACT_TO_EMAIL.
Laeuft gegen die Produktion, damit die Links in den Mails funktionieren.
"""
import io
import json
import re
import sys
import time
import urllib.error
import urllib.request

BASE = 'https://change-werkstatt-sahil.de'
TO = 'seref81@hotmail.com'
SRC = 'mailtest'

env = {}
for line in io.open('.env.local', encoding='utf-8'):
    line = line.strip()
    if '=' in line and not line.startswith('#'):
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
SB = env['SUPABASE_URL'].rstrip('/')
H = {'apikey': env['SUPABASE_SERVICE_ROLE_KEY'],
     'Authorization': 'Bearer ' + env['SUPABASE_SERVICE_ROLE_KEY']}
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

IDS = ['%d.%d' % (d, i) for d in range(1, 7) for i in range(1, 5)]
INVERSE = {'1.1', '1.2', '2.3', '3.3', '4.3', '5.1', '5.3', '5.4', '6.4'}


def profile(pos, inv):
    return {k: (inv if k in INVERSE else pos) for k in IDS}


def post(path, payload):
    req = urllib.request.Request(
        BASE + path, data=json.dumps(payload).encode('utf-8'),
        headers=dict(UA, **{'Content-Type': 'application/json'}))
    try:
        r = urllib.request.urlopen(req, timeout=120)
        return r.getcode(), json.loads(r.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', 'replace')
        try:
            return e.code, json.loads(body)
        except ValueError:
            return e.code, {'raw': body[:200]}


def get(path):
    r = urllib.request.urlopen(
        urllib.request.Request(BASE + path, headers=UA), timeout=120)
    t = r.read().decode('utf-8')
    return re.sub(r'&#x([0-9A-Fa-f]+);', lambda m: chr(int(m.group(1), 16)), t)


print('0) Deploy-Stand pruefen')
intro = get('/de/uebergabe-check')
if 'Beides ist kostenlos' in intro:
    print('   aktueller Stand ist live')
else:
    print('   NOCH ALTER STAND. Vercel deployt vermutlich noch.')
    if '--force' not in sys.argv:
        print('   Abbruch. Mit --force trotzdem senden.')
        sys.exit(1)

print('1) Assessment anlegen')
code, res = post('/api/uebergabe-check/submit',
                 {'answers': profile(4, 2), 'source': SRC})
aid = res.get('id')
print('   HTTP %d, id %s' % (code, aid))

print('2) Anmeldung: Bericht per Mail + Perspektivvergleich anlegen')
code, res = post('/api/uebergabe-check/lead', {
    'assessmentId': aid, 'name': 'Seref Sahil', 'email': TO,
    'company': 'Change-Werkstatt Sahil', 'consentReport': True,
    'consentMarketing': False, 'startComparison': True})
token = res.get('manageToken')
print('   HTTP %d, Verwaltungstoken %s' % (code, 'erhalten' if token else res))
if not token:
    sys.exit(1)
print('   -> MAIL 1 "Ihr persönlicher Ergebnis- und Arbeitsbericht"')
print('   -> interne Benachrichtigung an CONTACT_TO_EMAIL')

print('3) Eine Führungskraft antwortet')
time.sleep(2)
inv = post('/api/uebergabe-check/vergleich',
           {'action': 'invite', 'manageToken': token,
            'role': 'leader', 'note': 'Testteilnahme'})[1]['invite']
code, res = post('/api/uebergabe-check/submit',
                 {'answers': profile(2, 4), 'source': SRC,
                  'inviteToken': inv['token']})
print('   HTTP %d, im Vergleich: %s' % (code, res.get('partOfComparison')))
print('   -> MAIL 2 "Neue Einschätzung zu Ihrem Perspektivvergleich"')

print()
print('Ihre Links zum Nachsehen:')
print('   Bericht   : %s/de/uebergabe-check/ergebnis/%s' % (BASE, aid))
print('   Vergleich : %s/de/uebergabe-check/vergleich/%s' % (BASE, token))
print()
print('Die Testdaten bleiben vorerst stehen, damit die Links funktionieren.')
print('Zum Aufraeumen spaeter: python mailtest.py --cleanup')
