import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Sholes } from '../src/sholes.js';

function createTarget(id = 'sholes') {
  const el = document.createElement('div');
  el.id = id;
  document.body.appendChild(el);
  return el;
}

function cleanup(id = 'sholes') {
  const el = document.getElementById(id);
  if (el) el.remove();
  const style = document.getElementById('sholes-cursor-style');
  if (style) style.remove();
}

// ─── Instantiation ──────────────────────────────────────────────────────────

describe('Instantiation', () => {
  beforeEach(() => createTarget());
  afterEach(() => cleanup());

  it('creates an instance without throwing', () => {
    vi.useFakeTimers();
    const typer = new Sholes({ messages: ['Hello'] });
    expect(typer).toBeInstanceOf(Sholes);
    typer.stop();
    vi.useRealTimers();
  });

  it('merges user options over defaults', async () => {
    vi.useFakeTimers();
    const el = document.getElementById('sholes');
    const typer = new Sholes({ target: 'sholes', messages: ['Hi'], fSpeed: 5 });

    // Advance enough time to type the 'H' character (fSpeed 5ms + up to 25ms variance)
    await vi.advanceTimersByTimeAsync(100);
    expect(el.textContent.length).toBeGreaterThan(0);

    typer.stop();
    vi.useRealTimers();
  });

  it('warns and does not throw when target element is missing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const typer = new Sholes({ target: 'nonexistent' });
    expect(warn).toHaveBeenCalledWith(
      'Sholes: element with id "nonexistent" not found.'
    );
    expect(typer).toBeInstanceOf(Sholes);
    warn.mockRestore();
  });
});

// ─── Cursor ─────────────────────────────────────────────────────────────────

describe('Cursor', () => {
  beforeEach(() => createTarget());
  afterEach(() => cleanup());

  it('does not inject cursor elements when cursor is false (default)', () => {
    vi.useFakeTimers();
    new Sholes({ messages: ['Hi'], cursor: false }).stop();
    expect(document.querySelector('.sholes-cursor')).toBeNull();
    expect(document.getElementById('sholes-cursor-style')).toBeNull();
    vi.useRealTimers();
  });

  it('injects a cursor span and style tag when cursor is true', () => {
    vi.useFakeTimers();
    new Sholes({ messages: ['Hi'], cursor: true }).stop();
    expect(document.querySelector('.sholes-cursor')).not.toBeNull();
    expect(document.getElementById('sholes-cursor-style')).not.toBeNull();
    vi.useRealTimers();
  });

  it('uses the custom cursorChar when provided', () => {
    vi.useFakeTimers();
    new Sholes({ messages: ['Hi'], cursor: true, cursorChar: '_' }).stop();
    expect(document.querySelector('.sholes-cursor').textContent).toBe('_');
    vi.useRealTimers();
  });

  it('does not inject duplicate style tags on multiple instances', () => {
    vi.useFakeTimers();
    createTarget('sholes2');
    new Sholes({ target: 'sholes', messages: ['Hi'], cursor: true }).stop();
    new Sholes({ target: 'sholes2', messages: ['Hi'], cursor: true }).stop();
    expect(document.querySelectorAll('#sholes-cursor-style').length).toBe(1);
    cleanup('sholes2');
    vi.useRealTimers();
  });
});

// ─── stop() ─────────────────────────────────────────────────────────────────

describe('stop()', () => {
  beforeEach(() => createTarget());
  afterEach(() => cleanup());

  it('halts typing so text stops changing', async () => {
    vi.useFakeTimers();
    const el = document.getElementById('sholes');
    const typer = new Sholes({ messages: ['Hello world'], fSpeed: 50, variance: 0 });

    // Advance a little — a couple of characters should appear
    await vi.advanceTimersByTimeAsync(120);
    const textAfterStart = el.textContent;
    expect(textAfterStart.length).toBeGreaterThan(0);

    typer.stop();
    // Advance further — text should not change
    await vi.advanceTimersByTimeAsync(10000);
    expect(el.textContent).toBe(textAfterStart);

    vi.useRealTimers();
  });
});

// ─── Animation ──────────────────────────────────────────────────────────────

describe('Animation', () => {
  beforeEach(() => createTarget());
  afterEach(() => cleanup());

  it('types the first message character by character', async () => {
    vi.useFakeTimers();
    const el = document.getElementById('sholes');
    const msg = 'Hi';
    // Long remain/delay so the message stays visible well past the typing window
    const typer = new Sholes({ messages: [msg], fSpeed: 10, variance: 0, eSpeed: 5, remain: 5000, delay: 5000 });

    // 'H' appended at t=0, sleep(10) -> 'i' appended at t=10, sleep(10) -> done at t=20ms
    // Remain is 5000ms so the message is still visible at t=100ms
    await vi.advanceTimersByTimeAsync(100);
    expect(el.textContent).toBe(msg);

    typer.stop();
    vi.useRealTimers();
  });

  it('erases the message after the remain period', async () => {
    vi.useFakeTimers();
    const el = document.getElementById('sholes');
    const msg = 'Hi';
    const typer = new Sholes({ messages: [msg], fSpeed: 10, variance: 0, eSpeed: 5, remain: 50, delay: 50 });

    // 'H' at t=0, 'i' at t=10ms, done at t=20ms
    await vi.advanceTimersByTimeAsync(20);
    expect(el.textContent).toBe(msg);

    // remain ends at t=70ms; erase 2 chars * 5ms = t=80ms; well within 100ms advance
    await vi.advanceTimersByTimeAsync(100);
    expect(el.textContent).toBe('');

    typer.stop();
    vi.useRealTimers();
  });

  it('cycles to the second message after the first is erased', async () => {
    vi.useFakeTimers();
    const el = document.getElementById('sholes');
    const typer = new Sholes({
      messages: ['Hi', 'Bye'],
      fSpeed: 10,
      variance: 0,
      eSpeed: 5,
      remain: 50,
      delay: 50,
    });

    // Timeline with 2-char 'Hi', 3-char 'Bye', fSpeed=10, eSpeed=5, remain=50, delay=50:
    //   t=0:   'H' appended, sleep(10)
    //   t=10:  'i' appended, sleep(10)
    //   t=20:  #typeMessage done -> sleep(remain=50)
    //   t=70:  erase starts: 'Hi'->'H' sleep(5), t=75: 'H'->'' sleep(5), t=80: done
    //   t=80:  sleep(delay=50)
    //   t=130: 'B' appended, sleep(10)
    //   t=140: 'y' appended, sleep(10)
    //   t=150: 'e' appended, sleep(10)
    //   t=160: #typeMessage done; remain runs until t=210
    // Checking at t=200ms: 'Bye' is fully typed and remain hasn't expired
    await vi.advanceTimersByTimeAsync(200);
    expect(el.textContent).toBe('Bye');

    typer.stop();
    vi.useRealTimers();
  });

  it('loops back to message 0 after exhausting the array', async () => {
    vi.useFakeTimers();
    const el = document.getElementById('sholes');
    const msg = 'A';
    const typer = new Sholes({
      messages: [msg],
      fSpeed: 10,
      variance: 0,
      eSpeed: 5,
      remain: 50,
      delay: 50,
    });

    // 1-char 'A', fSpeed=10, eSpeed=5, remain=50, delay=50:
    //   Cycle 1: t=0 'A' appended, sleep(10) -> t=10 done -> remain t=60 -> erase t=65 -> delay t=115
    //   Cycle 2: t=115 'A' appended, sleep(10) -> t=125 done -> remain t=175 -> erase t=180 -> delay t=230
    //   Cycle 3: t=230 'A' appended, sleep(10) -> t=240 done -> remain runs to t=290
    // At t=260ms: 'A' is typed in cycle 3 and remain hasn't expired
    await vi.advanceTimersByTimeAsync(260);
    expect(el.textContent).toBe(msg);

    typer.stop();
    vi.useRealTimers();
  });
});
