/**
 * HunterMussel Chat Widget
 * Vanilla JS, no dependencies, < 15KB gzipped
 * Matches site dark aesthetic with green primary glow
 */
(function () {
  "use strict";

  // --- Configuration ---
  var API_URL =
    document.currentScript?.getAttribute("data-api-url") ||
    "https://huntermussel-chat-api.huntermussel.workers.dev";

  var CONTACT = {
    email: "contact@huntermussel.com",
    whatsapp: "https://wa.me/5521995775689",
    calendar: "https://cal.com/iago-mussel-2zqprh/secret",
    form: "https://huntermussel.com/contact/",
  };

  var MAX_MESSAGES = 20;

  // --- State ---
  var state = {
    open: false,
    messages: [],
    streaming: false,
    sessionId: null,
    messageCount: 0,
    showContact: false,
  };

  function getSessionId() {
    if (!state.sessionId) {
      state.sessionId =
        sessionStorage.getItem("hm-chat-session") ||
        "s-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      sessionStorage.setItem("hm-chat-session", state.sessionId);
    }
    return state.sessionId;
  }

  // --- Styles ---
  var CSS = `
    .hm-chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; line-height: 1.5; }
    .hm-chat-widget * { box-sizing: border-box; margin: 0; padding: 0; }

    .hm-toggle { width: 56px; height: 56px; border-radius: 50%; border: 1px solid hsl(145 80% 50% / 0.3); background: hsl(220 18% 7%); color: hsl(145 80% 50%); cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px hsl(145 80% 50% / 0.15), 0 0 60px hsl(145 80% 50% / 0.05), 0 4px 12px rgba(0,0,0,0.4); transition: all 0.3s ease; }
    .hm-toggle:hover { box-shadow: 0 0 30px hsl(145 80% 50% / 0.25), 0 0 80px hsl(145 80% 50% / 0.1), 0 4px 16px rgba(0,0,0,0.5); transform: scale(1.05); }
    .hm-toggle svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .hm-window { display: none; position: absolute; bottom: 70px; right: 0; width: 400px; height: 520px; background: hsl(220 20% 4%); border: 1px solid hsl(220 14% 14%); border-radius: 12px; overflow: hidden; flex-direction: column; box-shadow: 0 0 20px hsl(145 80% 50% / 0.08), 0 8px 32px rgba(0,0,0,0.6); }
    .hm-window.hm-open { display: flex; }

    .hm-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: hsl(220 18% 7%); border-bottom: 1px solid hsl(220 14% 14%); }
    .hm-header-title { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: hsl(210 40% 98%); }
    .hm-header-actions { display: flex; gap: 8px; align-items: center; }
    .hm-btn-human { font-size: 11px; padding: 4px 10px; border-radius: 6px; border: 1px solid hsl(145 80% 50% / 0.3); background: transparent; color: hsl(145 80% 50%); cursor: pointer; font-family: inherit; transition: all 0.2s; }
    .hm-btn-human:hover { background: hsl(145 80% 50% / 0.1); }
    .hm-btn-close { width: 28px; height: 28px; border: none; background: transparent; color: hsl(220 10% 62%); cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 18px; }
    .hm-btn-close:hover { color: hsl(210 40% 98%); background: hsl(220 14% 14%); }

    .hm-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth; }
    .hm-messages::-webkit-scrollbar { width: 4px; }
    .hm-messages::-webkit-scrollbar-track { background: transparent; }
    .hm-messages::-webkit-scrollbar-thumb { background: hsl(220 14% 14%); border-radius: 2px; }

    .hm-msg { max-width: 85%; padding: 10px 14px; border-radius: 10px; font-size: 13px; line-height: 1.6; word-wrap: break-word; white-space: pre-wrap; }
    .hm-msg a { color: hsl(145 80% 50%); text-decoration: underline; }
    .hm-msg-user { align-self: flex-end; background: hsl(145 80% 50% / 0.15); color: hsl(210 40% 98%); border-bottom-right-radius: 2px; }
    .hm-msg-assistant { align-self: flex-start; background: hsl(220 18% 7%); color: hsl(210 40% 90%); border: 1px solid hsl(220 14% 14%); border-bottom-left-radius: 2px; }

    .hm-typing { align-self: flex-start; display: flex; gap: 4px; padding: 12px 16px; background: hsl(220 18% 7%); border: 1px solid hsl(220 14% 14%); border-radius: 10px; border-bottom-left-radius: 2px; }
    .hm-typing-dot { width: 6px; height: 6px; border-radius: 50%; background: hsl(145 80% 50% / 0.5); animation: hm-bounce 1.4s infinite ease-in-out; }
    .hm-typing-dot:nth-child(2) { animation-delay: 0.16s; }
    .hm-typing-dot:nth-child(3) { animation-delay: 0.32s; }
    @keyframes hm-bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }

    .hm-quick-replies { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px; }
    .hm-quick-btn { font-size: 12px; padding: 6px 12px; border-radius: 16px; border: 1px solid hsl(220 14% 14%); background: hsl(220 18% 7%); color: hsl(210 40% 90%); cursor: pointer; font-family: inherit; transition: all 0.2s; }
    .hm-quick-btn:hover { border-color: hsl(145 80% 50% / 0.3); color: hsl(145 80% 50%); background: hsl(145 80% 50% / 0.05); }

    .hm-input-bar { display: flex; padding: 12px; border-top: 1px solid hsl(220 14% 14%); gap: 8px; background: hsl(220 18% 7%); }
    .hm-input { flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid hsl(220 14% 14%); background: hsl(220 20% 4%); color: hsl(210 40% 98%); font-size: 13px; font-family: inherit; outline: none; resize: none; }
    .hm-input:focus { border-color: hsl(145 80% 50% / 0.3); box-shadow: 0 0 8px hsl(145 80% 50% / 0.1); }
    .hm-input::placeholder { color: hsl(220 10% 42%); }
    .hm-send { width: 36px; height: 36px; border-radius: 8px; border: none; background: hsl(145 80% 50%); color: hsl(220 20% 4%); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .hm-send:hover { background: hsl(145 80% 55%); }
    .hm-send:disabled { opacity: 0.4; cursor: not-allowed; }
    .hm-send svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .hm-contact-panel { padding: 16px; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid hsl(220 14% 14%); background: hsl(220 18% 7%); }
    .hm-contact-title { font-size: 12px; color: hsl(220 10% 62%); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .hm-contact-link { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; border: 1px solid hsl(220 14% 14%); background: hsl(220 20% 4%); color: hsl(210 40% 90%); text-decoration: none; font-size: 13px; transition: all 0.2s; }
    .hm-contact-link:hover { border-color: hsl(145 80% 50% / 0.3); color: hsl(145 80% 50%); }
    .hm-contact-icon { width: 16px; height: 16px; flex-shrink: 0; }
    .hm-contact-back { font-size: 12px; color: hsl(220 10% 62%); background: none; border: none; cursor: pointer; text-align: center; padding: 4px; font-family: inherit; }
    .hm-contact-back:hover { color: hsl(210 40% 98%); }

    @media (max-width: 480px) {
      .hm-window { position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; border-radius: 0; border: none; }
      .hm-toggle { bottom: 16px; right: 16px; }
    }
  `;

  // --- SVG Icons ---
  var ICON_CHAT =
    '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  var ICON_CLOSE = "\u00D7";
  var ICON_SEND =
    '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
  var ICON_X =
    '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  // --- DOM Construction ---
  function createElement(tag, className, html) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (html) el.innerHTML = html;
    return el;
  }

  // --- Render simple markdown (bold, links, lists) ---
  function renderMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>'
      )
      .replace(
        /(^|\n)- (.+)/g,
        function (_, pre, item) { return pre + "\u2022 " + item; }
      )
      .replace(
        /(?:^|\s)(https?:\/\/[^\s<]+)/g,
        function (match, url) {
          // Don't double-link URLs already in anchor tags
          return ' <a href="' + url + '" target="_blank" rel="noopener">' + url + "</a>";
        }
      );
  }

  function buildWidget() {
    // Inject styles
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    // Container
    var container = createElement("div", "hm-chat-widget");

    // Toggle button
    var toggle = createElement("button", "hm-toggle", ICON_CHAT);
    toggle.setAttribute("aria-label", "Open chat assistant");
    toggle.addEventListener("click", function () {
      toggleChat();
    });

    // Chat window
    var win = createElement("div", "hm-window");

    // Header
    var header = createElement("div", "hm-header");
    var headerTitle = createElement(
      "span",
      "hm-header-title",
      "HunterMussel Assistant"
    );
    var headerActions = createElement("div", "hm-header-actions");
    var btnHuman = createElement("button", "hm-btn-human", "Talk to a human");
    btnHuman.addEventListener("click", function () {
      toggleContactPanel();
    });
    var btnClose = createElement("button", "hm-btn-close", ICON_CLOSE);
    btnClose.setAttribute("aria-label", "Close chat");
    btnClose.addEventListener("click", function () {
      toggleChat();
    });
    headerActions.appendChild(btnHuman);
    headerActions.appendChild(btnClose);
    header.appendChild(headerTitle);
    header.appendChild(headerActions);

    // Messages area
    var messagesArea = createElement("div", "hm-messages");

    // Quick replies
    var quickReplies = createElement("div", "hm-quick-replies");
    var quickButtons = [
      { label: "View services", text: "What services does HunterMussel offer?" },
      { label: "Start a project", text: "I'd like to start a project with HunterMussel" },
      {
        label: "Talk to a human",
        action: function () {
          toggleContactPanel();
        },
      },
    ];
    quickButtons.forEach(function (qb) {
      var btn = createElement("button", "hm-quick-btn", qb.label);
      btn.addEventListener("click", function () {
        if (qb.action) {
          qb.action();
        } else {
          sendMessage(qb.text);
          quickReplies.style.display = "none";
        }
      });
      quickReplies.appendChild(btn);
    });

    // Input bar
    var inputBar = createElement("div", "hm-input-bar");
    var input = createElement("input", "hm-input");
    input.type = "text";
    input.placeholder = "Ask about our services...";
    input.setAttribute("aria-label", "Type your message");
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input.value);
      }
    });
    var sendBtn = createElement("button", "hm-send", ICON_SEND);
    sendBtn.setAttribute("aria-label", "Send message");
    sendBtn.addEventListener("click", function () {
      sendMessage(input.value);
    });
    inputBar.appendChild(input);
    inputBar.appendChild(sendBtn);

    // Contact panel (hidden by default)
    var contactPanel = createElement("div", "hm-contact-panel");
    contactPanel.style.display = "none";
    contactPanel.innerHTML =
      '<div class="hm-contact-title">Get in touch</div>' +
      '<a class="hm-contact-link" href="mailto:' +
      CONTACT.email +
      '">' +
      '<span class="hm-contact-icon">&#9993;</span> ' +
      CONTACT.email +
      "</a>" +
      '<a class="hm-contact-link" href="' +
      CONTACT.whatsapp +
      '" target="_blank" rel="noopener">' +
      '<span class="hm-contact-icon">&#128172;</span> WhatsApp' +
      "</a>" +
      '<a class="hm-contact-link" href="' +
      CONTACT.calendar +
      '" target="_blank" rel="noopener">' +
      '<span class="hm-contact-icon">&#128197;</span> Schedule a call' +
      "</a>" +
      '<a class="hm-contact-link" href="' +
      CONTACT.form +
      '">' +
      '<span class="hm-contact-icon">&#128221;</span> Contact form' +
      "</a>" +
      '<button class="hm-contact-back">Back to chat</button>';
    contactPanel.querySelector(".hm-contact-back").addEventListener(
      "click",
      function () {
        toggleContactPanel();
      }
    );

    // Assemble
    win.appendChild(header);
    win.appendChild(messagesArea);
    win.appendChild(quickReplies);
    win.appendChild(contactPanel);
    win.appendChild(inputBar);
    container.appendChild(win);
    container.appendChild(toggle);
    document.body.appendChild(container);

    // Store references
    state.els = {
      container: container,
      toggle: toggle,
      win: win,
      messagesArea: messagesArea,
      quickReplies: quickReplies,
      input: input,
      sendBtn: sendBtn,
      contactPanel: contactPanel,
      inputBar: inputBar,
    };

    // Add welcome message
    addMessage(
      "assistant",
      "Hi! I'm HunterMussel's assistant. I can answer questions about our services, tech stack, and how we work.\n\nHow can I help?"
    );

    // Keyboard: Escape to close
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.open) {
        toggleChat();
      }
    });
  }

  function toggleChat() {
    state.open = !state.open;
    state.els.win.classList.toggle("hm-open", state.open);
    state.els.toggle.innerHTML = state.open ? ICON_X : ICON_CHAT;
    state.els.toggle.setAttribute(
      "aria-label",
      state.open ? "Close chat assistant" : "Open chat assistant"
    );
    if (state.open) {
      state.els.input.focus();
    }
  }

  function toggleContactPanel() {
    state.showContact = !state.showContact;
    state.els.contactPanel.style.display = state.showContact ? "flex" : "none";
    state.els.inputBar.style.display = state.showContact ? "none" : "flex";
    state.els.quickReplies.style.display = state.showContact
      ? "none"
      : state.messages.length <= 1
        ? "flex"
        : "none";
  }

  function addMessage(role, content) {
    var msg = createElement(
      "div",
      "hm-msg hm-msg-" + role,
      role === "assistant" ? renderMarkdown(content) : escapeHtml(content)
    );
    state.els.messagesArea.appendChild(msg);
    state.messages.push({ role: role, content: content });
    scrollToBottom();
    return msg;
  }

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function showTyping() {
    var typing = createElement(
      "div",
      "hm-typing",
      '<div class="hm-typing-dot"></div><div class="hm-typing-dot"></div><div class="hm-typing-dot"></div>'
    );
    typing.id = "hm-typing";
    state.els.messagesArea.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    var typing = document.getElementById("hm-typing");
    if (typing) typing.remove();
  }

  function scrollToBottom() {
    var area = state.els.messagesArea;
    area.scrollTop = area.scrollHeight;
  }

  function setInputEnabled(enabled) {
    state.els.input.disabled = !enabled;
    state.els.sendBtn.disabled = !enabled;
    state.streaming = !enabled;
  }

  // --- API Communication ---
  async function sendMessage(text) {
    text = (text || "").trim();
    if (!text || state.streaming) return;

    if (state.messageCount >= MAX_MESSAGES) {
      addMessage(
        "assistant",
        "You've reached the message limit for this session. Feel free to reach out directly:\n\n- Email: " +
          CONTACT.email +
          "\n- WhatsApp: " +
          CONTACT.whatsapp
      );
      return;
    }

    // Hide quick replies after first message
    state.els.quickReplies.style.display = "none";

    addMessage("user", text);
    state.els.input.value = "";
    state.messageCount++;
    setInputEnabled(false);
    showTyping();

    try {
      var response = await fetch(API_URL + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: state.messages.filter(function (m) {
            return m.role === "user" || m.role === "assistant";
          }),
          sessionId: getSessionId(),
        }),
      });

      hideTyping();

      if (!response.ok) {
        throw new Error("API error: " + response.status);
      }

      // Stream SSE response
      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var assistantMsg = addMessage("assistant", "");
      var fullContent = "";
      var buffer = "";

      while (true) {
        var result = await reader.read();
        if (result.done) break;

        buffer += decoder.decode(result.value, { stream: true });
        var lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (!line.startsWith("data: ")) continue;

          var data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            var parsed = JSON.parse(data);
            if (parsed.content) {
              fullContent += parsed.content;
              assistantMsg.innerHTML = renderMarkdown(fullContent);
              scrollToBottom();
            }
          } catch (e) {
            // Skip malformed chunks
          }
        }
      }

      // Update the stored message content
      state.messages[state.messages.length - 1].content = fullContent;
    } catch (err) {
      hideTyping();
      addMessage(
        "assistant",
        "I'm having trouble connecting right now. You can reach us directly:\n\n- Email: " +
          CONTACT.email +
          "\n- WhatsApp: " +
          CONTACT.whatsapp +
          "\n- Schedule a call: " +
          CONTACT.calendar
      );
    } finally {
      setInputEnabled(true);
      state.els.input.focus();
    }
  }

  // --- Initialize ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();
