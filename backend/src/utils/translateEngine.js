// backend/src/utils/translateEngine.js
/**
 * Simple rule-based/dictionary translator for MVP between Portuguese and Kimbundu/Umbundu/Kikongo.
 * This is deterministic and small. Extend later with external services.
 */

const DICTIONARIES = {
  'pt->kmn': {
    'olá': 'mbote',
    'bom dia': 'mbote mbaï',
    'obrigado': 'dikala',
    'por favor': 'ndidi'
  },
  'kmn->pt': {
    'mbote': 'olá',
    'dikala': 'obrigado'
  },
  'pt->umb': {
    'olá': 'ovule',
    'bom dia': 'ovule wayi',
    'obrigado': 'katala'
  },
  'umb->pt': {
    'ovule': 'olá',
    'katala': 'obrigado'
  },
  'pt->kng': {
    'olá': 'mbote',
    'obrigado': 'tata'
  },
  'kng->pt': {
    'mbote': 'olá',
    'tata': 'obrigado'
  }
};

function normalize(s) {
  return (s || '').trim().toLowerCase();
}

function translate(text, fromLang, toLang) {
  const key = `${fromLang}->${toLang}`;
  const dict = DICTIONARIES[key] || {};
  const n = normalize(text);
  if (dict[n]) {
    return { translatedText: dict[n], confidence: 0.95 };
  }

  // simple word-by-word fallback
  const words = n.split(/\s+/);
  const out = words.map(w => dict[w] || w).join(' ');
  return { translatedText: out, confidence: 0.6 };
}

module.exports = translate;
