/**
 * MindMate Intelligence Engine (Offline / No API)
 * -----------------------------------------------
 * Purpose:
 * - Stable chatbot for mental health conversations
 * - No external API dependency
 * - Emotion detection + empathetic replies
 * - Safe for deadlines & demos
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function getGeminiResponse(message) {
  const input = message.toLowerCase();

  // =========================
  // 🚨 CRISIS / SAFETY FIRST
  // =========================
  if (/suicide|kill myself|end my life|hurt myself|self harm/i.test(input)) {
    return "[SAD] I’m really concerned about you. Please talk to someone right now. You matter more than you know. 💙";
  }

  // =========================
  // 👋 GREETINGS
  // =========================
  if (/hi|hello|hey|good morning|good evening/i.test(input)) {
    return pick([
      "[NEUTRAL] Hello! I’m MindMate. How are you feeling today?",
      "[NEUTRAL] Hi there. I’m here to listen. What’s on your mind?",
    ]);
  }

  // =========================
  // 📚 EXAM / STUDY STRESS
  // =========================
  if (/exam|test|study|college|school|fail|marks/i.test(input)) {
    return pick([
      "[SAD] Exams can feel overwhelming. Try focusing on just one small task at a time.",
      "[NEUTRAL] That pressure sounds tough. What subject is worrying you the most?",
    ]);
  }

  // =========================
  // 😟 ANXIETY / WORRY
  // =========================
  if (/anxious|anxiety|panic|nervous|worried|fear/i.test(input)) {
    return pick([
      "[SAD] Anxiety can feel heavy. Let’s slow down together. What triggered this feeling?",
      "[NEUTRAL] I hear your worry. Try taking a deep breath—what’s making you anxious right now?",
    ]);
  }

  // =========================
  // 😔 SADNESS / LOW MOOD
  // =========================
  if (/sad|depressed|cry|unhappy|down|lonely/i.test(input)) {
    return pick([
      "[SAD] I’m really sorry you’re feeling this way. You don’t have to go through it alone.",
      "[NEUTRAL] Thank you for opening up. Want to tell me what’s been bothering you?",
    ]);
  }

  // =========================
  // 😊 POSITIVE EMOTIONS
  // =========================
  if (/happy|good|great|awesome|excited|relieved/i.test(input)) {
    return pick([
      "[HAPPY] That’s great to hear! What’s been going well for you?",
      "[HAPPY] I love hearing that 😊 Want to share more?",
    ]);
  }

  // =========================
  // 🙏 THANK YOU / GOODBYE
  // =========================
  if (/thank you|thanks|bye|goodbye/i.test(input)) {
    return pick([
      "[HAPPY] You’re welcome! I’m always here if you need to talk.",
      "[NEUTRAL] Take care of yourself. Reach out anytime.",
    ]);
  }

  // =========================
  // 🧠 DEFAULT REFLECTIVE RESPONSE
  // =========================
  return pick([
    "[NEUTRAL] I’m listening. Can you tell me more?",
    "[NEUTRAL] That sounds important. How long have you felt this way?",
    "[NEUTRAL] I see. What’s the hardest part for you right now?",
  ]);
}

module.exports = { getGeminiResponse };
