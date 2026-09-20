/* @ds-bundle: {"format":4,"namespace":"Mosaic","components":[{"name":"Button"},{"name":"Input"},{"name":"Select"},{"name":"Toggle"},{"name":"Segmented"},{"name":"Badge"},{"name":"Banner"},{"name":"Toolbar"},{"name":"Card"},{"name":"Tabs"},{"name":"Dialog"},{"name":"RailSection"},{"name":"SlotZone"},{"name":"DataBind"},{"name":"ResultLine"},{"name":"StatusBar"},{"name":"EmptyState"},{"name":"KeyboardMove"}]} */
/* Mosaic UI — behaviour layer.
   Framework-neutral on purpose: the markup contract is the product, and the
   React layer in the Drupal module renders these same class names. Everything
   here is event delegation on `document`, so it works on markup that arrives
   after this script and needs no mount step. */
(function (global) {
  'use strict';

  var ROOT = '.mosaic';

  function closest(el, sel) {
    return el && el.closest ? el.closest(sel) : null;
  }
  function inRoot(el) {
    return !!closest(el, ROOT);
  }
  function siblings(el, sel) {
    if (!el || !el.parentElement) return [];
    return Array.prototype.filter.call(el.parentElement.children, function (n) {
      return n !== el && n.matches && n.matches(sel);
    });
  }

  /* --- collapsible rail sections and palette groups ---------------------- */

  function toggleExpanded(head) {
    var open = head.getAttribute('aria-expanded') === 'true';
    head.setAttribute('aria-expanded', String(!open));
    var body = head.nextElementSibling;
    if (body && (body.classList.contains('m-section__body') || body.classList.contains('m-palette__list'))) {
      body.hidden = open;
    }
  }

  /* --- segmented switcher ------------------------------------------------ */

  function pressSegment(item) {
    siblings(item, '.m-seg__item').forEach(function (n) { n.setAttribute('aria-pressed', 'false'); });
    item.setAttribute('aria-pressed', 'true');
  }

  function moveSegment(item, delta) {
    var all = Array.prototype.slice.call(item.parentElement.querySelectorAll('.m-seg__item'));
    var next = all[(all.indexOf(item) + delta + all.length) % all.length];
    if (next) { next.focus(); pressSegment(next); }
  }

  /* --- switches ---------------------------------------------------------- */

  function flipSwitch(el) {
    var on = el.getAttribute('aria-checked') === 'true';
    if (el.getAttribute('aria-disabled') === 'true') return;
    el.setAttribute('aria-checked', String(!on));
    el.dispatchEvent(new CustomEvent('mosaic:change', { bubbles: true, detail: { checked: !on } }));
  }

  /* --- tabs -------------------------------------------------------------- */

  function selectTab(tab) {
    siblings(tab, '.m-tab').forEach(function (n) { n.setAttribute('aria-selected', 'false'); });
    tab.setAttribute('aria-selected', 'true');
  }

  /* --- delegation -------------------------------------------------------- */

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!inRoot(t)) return;
    var head = closest(t, '.m-section__head, .m-palette__grouphead');
    if (head) { toggleExpanded(head); return; }
    var segItem = closest(t, '.m-seg__item');
    if (segItem) { pressSegment(segItem); return; }
    var sw = closest(t, '[role="switch"], [role="checkbox"]');
    if (sw) { flipSwitch(sw); return; }
    var tab = closest(t, '.m-tab');
    if (tab) { selectTab(tab); }
  });

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (!inRoot(t)) return;
    var sw = closest(t, '[role="switch"], [role="checkbox"]');
    if (sw && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); flipSwitch(sw); return; }
    var segItem = closest(t, '.m-seg__item');
    if (segItem && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault();
      moveSegment(segItem, e.key === 'ArrowRight' ? 1 : -1);
    }
  });

  /* --- theme ------------------------------------------------------------- */

  function setTheme(id) {
    document.documentElement.setAttribute('data-theme', id);
    return id;
  }
  function theme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue('--' + name).trim();
  }

  /* --- the readiness vocabulary, as data --------------------------------- */

  var READINESS = {
    ready: { label: 'Ready', glyph: '✔', modifier: 'ready' },
    attention: { label: 'Attention', glyph: '▲', modifier: 'attention' },
    blocked: { label: 'Blocked', glyph: '■', modifier: 'blocked' }
  };

  var DATA_STATES = ['populated', 'one', 'empty', 'failing'];

  var KEYBOARD_MOVE = [
    { keys: ['ArrowUp', 'ArrowDown'], does: 'before or after the previous or next sibling' },
    { keys: ['ArrowRight'], does: 'into the slot that follows' },
    { keys: ['ArrowLeft'], does: 'out to the parent' },
    { keys: ['Enter'], does: 'drop here' },
    { keys: ['Escape'], does: 'put it back exactly where it was' }
  ];

  global.Mosaic = {
    version: '1.0.0',
    setTheme: setTheme,
    theme: theme,
    token: token,
    READINESS: READINESS,
    DATA_STATES: DATA_STATES,
    KEYBOARD_MOVE: KEYBOARD_MOVE
  };
}(window));
