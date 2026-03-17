const rateLimit = require('express-rate-limit')

// ── Tier 1 — Global DDoS protection ──────────────────────────────────────────
// Every single request to the API — catches mass flood attacks
// 300 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down' },
  skip: (req) => req.path === '/api/health', // don't limit health checks
})

// ── Tier 2 — Auth endpoint protection ────────────────────────────────────────
// Login + register combined — stops credential stuffing and brute force
// 20 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again in 15 minutes' },
})

// ── Tier 3 — Register endpoint specifically ──────────────────────────────────
// Much stricter — stops mass account creation / spam
// 5 accounts per hour per IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many accounts created from this IP, please try again later' },
})

module.exports = { globalLimiter, authLimiter, registerLimiter }
