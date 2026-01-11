import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jsonServer = require('json-server');

console.log('Starting server.js...');
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// --- AUTH MOCK ---
server.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db; // Lowdb instance
  
  try {
      const debugFile = '/Users/bashir/Desktop/asset-declaration/ads-app/ads_debug.log';
      const logMsg = `\n[${new Date().toISOString()}] Login Attempt: Body=${JSON.stringify(req.body)}`;
      fs.appendFileSync(debugFile, logMsg);
      
      const user = db.get('users').find({ email }).value();
      const userMsg = `\n[${new Date().toISOString()}] User Found Lookup '${email}': ${user ? 'YES' : 'NO'}`;
      fs.appendFileSync(debugFile, userMsg);
  } catch(e) {
      console.error("Logging failed", e);
  }

  const user = db.get('users').find({ email }).value();

  if (user) {
    if (user.status === 'Inactive') {
        return res.status(403).json('Account is deactivated');
    }
    const { password: _, ...userWithoutPass } = user;
    return res.json({ ...userWithoutPass, token: "mock-jwt-token" });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

server.post('/api/auth/logout', (req, res) => {
  res.sendStatus(200);
});

server.get('/api/auth/me', (req, res) => {
    res.sendStatus(401); 
});

// --- CUSTOM ROUTES MAPPING ---

// Officer Declarations
server.get('/api/officer/declarations', (req, res) => {
    const db = router.db;
    const decls = db.get('declarations').value();
    res.json(decls);
});

server.post('/api/officer/declarations', (req, res) => {
    const data = req.body;
    const db = router.db;
    
    // Auto-generate ID and Fields
    const newDecl = {
        ...data, // Persist ALL form data (family, detailed assets, etc)
        id: `d${Date.now()}`,
        userId: 'u3', // Force to Officer u3 for demo consistency
        year: new Date(data.declarationDate).getFullYear(),
        date: data.declarationDate,
        status: 'SUBMITTED',
        // Keep summary for dashboard compatibility
        assets: {
          cash: data.cashAssets?.reduce((acc, curr) => acc + (curr.balance || 0), 0) || 0,
          immovable: data.immovableAssets?.reduce((acc, curr) => acc + (curr.currentValue || 0), 0) || 0,
          movable: data.movableAssets?.reduce((acc, curr) => acc + (curr.currentValue || 0), 0) || 0,
          securities: data.securities?.reduce((acc, curr) => acc + (curr.currentMarketValue || 0), 0) || 0,
          other: data.otherAssets?.reduce((acc, curr) => acc + (curr.value || 0), 0) || 0,
        },
        totalLiabilities: data.liabilities?.reduce((acc, curr) => acc + (curr.outstandingAmount || 0), 0) || 0,
    };
    
    db.get('declarations').push(newDecl).write();
    res.status(201).json({ success: true, id: newDecl.id });
});

// Admin Declarations
server.get('/api/ads-admin/declarations', (req, res) => {
     const db = router.db;
     const decls = db.get('declarations').value();
     res.json(decls);
});

// Stats
server.get('/api/public/stats', (req, res) => {
    const db = router.db;
    const decls = db.get('declarations').value();
    const staticStats = db.get('stats').value() || {};

    // Calculate Dynamic Stats
    const totalDeclarations = decls.length;
    
    // Calculate Total Asset Value (Simulated sum)
    const totalValue = decls.reduce((acc, d) => {
        const a = d.assets || {};
        return acc + (a.cash || 0) + (a.immovable || 0) + (a.movable || 0) + (a.securities || 0) + (a.other || 0);
    }, 0);

    // MDA Compliance
    const mdaCounts = {};
    decls.forEach(d => {
        const mda = d.employment?.[0]?.employer || "Other";
        mdaCounts[mda] = (mdaCounts[mda] || 0) + 1;
    });

    const complianceByMda = Object.entries(mdaCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5

    res.json({
        ...staticStats,
        totalDeclarations,
        assetsDeclared: (totalValue / 1000000).toFixed(1) + "M",
        complianceByMda
    });
});

// Verification Search
server.get('/api/public/verify', (req, res) => {
    const { q } = req.query;
    console.log(`\n[${new Date().toISOString()}] SEARCH REQUEST: q='${q}'`);
    
    if (!q) return res.json({ result: null });
    
    const db = router.db;
    const decls = db.get('declarations').value();
    const query = q.toString().toLowerCase().trim().replace(/['"]/g, '');
    
    // Log for debug (server stdout)
    console.log(`Checking vs sanitized: [${query}]`);

    // DEBUG BACKDOOR
    if (query === 'debug') {
        const first = decls[0];
        console.log("DEBUG BACKDOOR TRIGGERED");
        return res.json({
            found: true,
            name: `DEBUG: ${first.otherNames} ${first.surname}`,
            year: first.year
        });
    }

    console.log(`Checking ${decls.length} declarations against query: '${query}'`);

    const found = decls.find(d => {
        const surname = (d.surname || "").toLowerCase();
        const otherNames = (d.otherNames || "").toLowerCase();
        
        const fullName1 = `${surname} ${otherNames}`.trim();
        const fullName2 = `${otherNames} ${surname}`.trim();
        
        const match = fullName1.includes(query) || fullName2.includes(query);
        if (match) console.log(` >> MATCH FOUND: ${d.id} (${fullName1})`);
        return match;
    });

    if(!found) console.log(" >> No match found.");

    res.json({ 
        found: !!found, 
        name: found ? `${found.otherNames} ${found.surname}` : null,
        year: found ? found.year : null
    });
});

// Reports
server.get('/api/ads-admin/reports', (req, res) => {
    const reports = router.db.get('reports').value();
    res.json(reports);
});

// Metrics
server.get('/api/admin/metrics', (req, res) => {
    const db = router.db;
    const users = db.get('users').value();
    const decls = db.get('declarations').value();
    
    res.json({
        totalUsers: users.length,
        activeDeclarations: decls.length,
        complianceRate: 85
    });
});

// Verifier Assignment
server.get('/api/verifier/assignments', (req, res) => {
     const db = router.db;
     const pending = db.get('declarations').filter(d => d.status === 'PENDING_VERIFICATION' || d.status === 'SUBMITTED').value();
     res.json(pending);
});

// Update Status (Admin/Verifier)
server.patch('/api/ads-admin/declarations/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const db = router.db;
    
    const decl = db.get('declarations').find({ id }).value();
    if(decl) {
        db.get('declarations').find({ id }).assign({ status, remarks }).write();
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

// Admin Users
server.get('/api/admin/users', (req, res) => {
    const users = router.db.get('users').value();
    res.json(users);
});

server.post('/api/admin/users', (req, res) => {
    const newUser = req.body;
    newUser.id = `u${Date.now()}`;
    newUser.status = 'Active';
    router.db.get('users').push(newUser).write();
    res.status(201).json(newUser);
});

// Admin Audit Logs
server.get('/api/admin/audit-logs', (req, res) => {
    const logs = router.db.get('audit_logs').value();
    res.json(logs || []);
});

// Admin Settings
server.get('/api/admin/settings', (req, res) => {
    const settings = router.db.get('settings').value();
    res.json(settings || { siteName: "Asset Declaration System" });
});

server.post('/api/admin/settings', (req, res) => {
    const settings = req.body;
    router.db.set('settings', settings).write();
    res.json({ success: true });
});

// REFERENCE DATA ROUTES
server.get('/api/admin/mdas', (req, res) => {
    const mdas = router.db.get('mdas').value();
    res.json(mdas);
});

server.get('/api/reference/banks', (req, res) => { res.json(router.db.get('banks').value()); });
server.get('/api/reference/districts', (req, res) => { res.json(router.db.get('districts').value()); });
server.get('/api/reference/currencies', (req, res) => { res.json(router.db.get('currencies').value()); });

// Use default router for everything else
server.use('/api', router);

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
