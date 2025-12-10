(async ()=>{
  try {
    const base = 'http://localhost:5000';
    const email = `autotest_${Date.now()}@example.com`;
    console.log('Using test email', email);

    // signup
    let res = await fetch(`${base}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'AutoTest', email, password: 'TestPass123', role: 'customer' })
    });
    let body = await res.json().catch(()=>null);
    console.log('/signup', res.status, body);

    // login
    res = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'TestPass123', role: 'customer' })
    });
    body = await res.json().catch(()=>null);
    console.log('/login', res.status, body);
    if (!body || !body.token) {
      console.error('Login failed, aborting');
      return;
    }
    const token = body.token;

    // deposit
    res = await fetch(`${base}/customer/me/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount: 100 })
    });
    const text = await res.text().catch(()=>null);
    let parsed = null;
    try { parsed = JSON.parse(text); } catch(e) { parsed = text; }
    console.log('/customer/me/deposit', res.status, parsed);
  } catch (err) {
    console.error('Script error', err);
  }
})();
