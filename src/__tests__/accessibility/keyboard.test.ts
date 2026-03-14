import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = path.resolve(__dirname, "../..");

function read(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), "utf-8");
}

// ---------------------------------------------------------------------------
// 1. SearchInput Cmd+K keyboard shortcut
// ---------------------------------------------------------------------------
describe("SearchInput Cmd+K keyboard shortcut", () => {
  const src = read("components/ui/search-input.tsx");

  it("registers a global keydown listener", () => {
    expect(src).toContain('document.addEventListener("keydown"');
  });

  it("checks for metaKey (Cmd on Mac)", () => {
    expect(src).toContain("e.metaKey");
  });

  it("checks for ctrlKey (Ctrl on Windows/Linux)", () => {
    expect(src).toContain("e.ctrlKey");
  });

  it("compares key to shortcutKey prop (default K)", () => {
    expect(src).toContain("e.key.toLowerCase() === shortcutKey.toLowerCase()");
  });

  it("prevents default browser behavior on Cmd+K", () => {
    expect(src).toContain("e.preventDefault()");
  });

  it("focuses the input element on Cmd+K", () => {
    expect(src).toContain("inputRef.current?.focus()");
  });

  it("default shortcutKey is K", () => {
    expect(src).toContain('shortcutKey = "K"');
  });

  it("cleans up keydown listener on unmount", () => {
    expect(src).toContain('document.removeEventListener("keydown"');
  });

  it("displays the keyboard shortcut hint visually", () => {
    expect(src).toContain("<kbd");
    expect(src).toContain("{shortcutKey}");
  });

  it("displays the command symbol (⌘)", () => {
    expect(src).toContain("&#8984;");
  });
});

// ---------------------------------------------------------------------------
// 2. Modal Escape key handling
// ---------------------------------------------------------------------------
describe("Modal Escape key handling", () => {
  const src = read("components/ui/modal.tsx");

  it("listens for keydown events on document", () => {
    expect(src).toContain('document.addEventListener("keydown", handleEscape)');
  });

  it("checks for Escape key", () => {
    expect(src).toContain('e.key === "Escape"');
  });

  it("calls onClose when Escape is pressed", () => {
    expect(src).toContain("onClose()");
  });

  it("only binds listener when modal is open", () => {
    expect(src).toContain("if (!open) return");
  });

  it("removes listener in cleanup function", () => {
    expect(src).toContain('document.removeEventListener("keydown", handleEscape)');
  });
});

// ---------------------------------------------------------------------------
// 3. Dropdown Escape key handling
// ---------------------------------------------------------------------------
describe("Dropdown Escape key handling", () => {
  const src = read("components/ui/dropdown-menu.tsx");

  it("listens for keydown events to handle Escape", () => {
    expect(src).toContain('document.addEventListener("keydown", handleEscape)');
  });

  it("checks for Escape key press", () => {
    expect(src).toContain('e.key === "Escape"');
  });

  it("calls close() when Escape is pressed", () => {
    expect(src).toContain("close()");
  });

  it("only binds when dropdown is open", () => {
    expect(src).toContain("if (!open) return");
  });

  it("cleans up listener on close/unmount", () => {
    expect(src).toContain('document.removeEventListener("keydown", handleEscape)');
  });
});

// ---------------------------------------------------------------------------
// 4. Tab navigation on form elements
// ---------------------------------------------------------------------------
describe("Tab navigation on form elements", () => {
  const loginSrc = read("app/(auth)/login/page.tsx");
  const registerSrc = read("app/(auth)/register/page.tsx");

  it("login form has email input (naturally tabbable)", () => {
    expect(loginSrc).toContain('type="email"');
  });

  it("login form has password input (naturally tabbable)", () => {
    expect(loginSrc).toContain('type="password"');
  });

  it("login form has submit button (naturally tabbable)", () => {
    expect(loginSrc).toContain('type="submit"');
  });

  it("register form has text input for name", () => {
    expect(registerSrc).toContain('type="text"');
  });

  it("register form has email input", () => {
    expect(registerSrc).toContain('type="email"');
  });

  it("register form has password inputs", () => {
    const matches = registerSrc.match(/type="password"/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(2);
  });

  it("register form has submit button", () => {
    expect(registerSrc).toContain('type="submit"');
  });

  it("Input component does not use negative tabindex", () => {
    const src = read("components/ui/input.tsx");
    expect(src).not.toContain("tabIndex={-1}");
    expect(src).not.toContain('tabIndex="-1"');
  });
});

// ---------------------------------------------------------------------------
// 5. Enter key triggers actions
// ---------------------------------------------------------------------------
describe("Enter key triggers actions", () => {
  it("SearchInput triggers onSearch on Enter key", () => {
    const src = read("components/ui/search-input.tsx");
    expect(src).toContain('e.key === "Enter"');
    expect(src).toContain("onSearch?.(e.currentTarget.value)");
  });

  it("login form uses onSubmit (Enter key submits forms natively)", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain("onSubmit={handleSubmit}");
  });

  it("register form uses onSubmit", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain("onSubmit={handleSubmit}");
  });

  it("tasks page add-task Input handles Enter key", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain('e.key === "Enter"');
    expect(src).toContain("addTask()");
  });
});

// ---------------------------------------------------------------------------
// 6. Interactive elements are focusable
// ---------------------------------------------------------------------------
describe("Interactive elements are focusable", () => {
  it("Button component renders <button> (inherently focusable)", () => {
    const src = read("components/ui/button.tsx");
    expect(src).toContain("<button");
  });

  it("DropdownMenuTrigger is a <button> (inherently focusable)", () => {
    const src = read("components/ui/dropdown-menu.tsx");
    expect(src).toContain("<button");
  });

  it("DropdownMenuItem is a <button> (inherently focusable)", () => {
    const src = read("components/ui/dropdown-menu.tsx");
    const itemSection = src.substring(src.indexOf("DropdownMenuItem"));
    expect(itemSection).toContain("<button");
  });

  it("TabsTrigger is a <button> (inherently focusable)", () => {
    const src = read("components/ui/tabs.tsx");
    const triggerSection = src.substring(src.indexOf("TabsTrigger"));
    expect(triggerSection).toContain("<button");
  });

  it("ModalCloseButton is a <button> (inherently focusable)", () => {
    const src = read("components/ui/modal.tsx");
    const closeSection = src.substring(src.indexOf("ModalCloseButton"));
    expect(closeSection).toContain("<button");
  });

  it("sidebar collapse button is focusable", () => {
    const src = read("components/layout/sidebar.tsx");
    expect(src).toContain("<button");
  });

  it("header search input is focusable", () => {
    const src = read("components/layout/header.tsx");
    expect(src).toContain('<input');
    expect(src).toContain('type="text"');
  });

  it("header quick create button is focusable", () => {
    const src = read("components/layout/header.tsx");
    expect(src).toContain("<button");
  });

  it("mobile menu button is focusable", () => {
    const src = read("components/layout/dashboard-layout.tsx");
    expect(src).toContain("<button");
  });

  it("navigation links use <Link> which renders <a> (focusable)", () => {
    const src = read("components/layout/sidebar.tsx");
    expect(src).toContain("<Link");
  });
});
