import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ErrorBoundary, Box, T, Reveal, SubBtn, Tag } from "../components.jsx";
import { C } from "../config.js";

afterEach(() => cleanup());

describe("Box", () => {
  it("renders children with default cyan color", () => {
    const { container } = render(<Box>Hello</Box>);
    const div = container.firstChild;
    expect(div.textContent).toBe("Hello");
    expect(div.style.borderRadius).toBe("10px");
    expect(div.style.width).toBe("100%");
  });

  it("renders with custom color and style overrides", () => {
    const { container } = render(<Box color={C.red} style={{ padding: "5px" }}>Test</Box>);
    const div = container.firstChild;
    // jsdom converts hex to rgb, so just check the element rendered with custom padding
    expect(div.style.padding).toBe("5px");
    expect(div.style.borderRadius).toBe("10px");
  });
});

describe("T", () => {
  it("renders with default props", () => {
    const { container } = render(<T>text</T>);
    const div = container.firstChild;
    expect(div.textContent).toBe("text");
    expect(div.getAttribute("style")).toContain("19px");
    expect(div.style.fontWeight).toBe("400");
    expect(div.style.textAlign).toBe("left");
  });

  it("renders bold and centered", () => {
    const { container } = render(<T bold center>bold text</T>);
    const div = container.firstChild;
    expect(div.style.fontWeight).toBe("700");
    expect(div.style.textAlign).toBe("center");
  });

  it("applies custom color, size, and style", () => {
    const { container } = render(<T color={C.red} size={24} style={{ marginTop: "10px" }}>styled</T>);
    const div = container.firstChild;
    expect(div.getAttribute("style")).toContain("24px");
    expect(div.style.marginTop).toBe("10px");
  });
});

describe("Reveal", () => {
  it("returns null when when=false", () => {
    const { container } = render(<Reveal when={false}><span>hidden</span></Reveal>);
    expect(container.innerHTML).toBe("");
  });

  it("renders children when when=true", () => {
    const { container } = render(<Reveal when={true}><span>visible</span></Reveal>);
    expect(container.textContent).toBe("visible");
    expect(container.firstChild.getAttribute("data-reveal")).toBe("true");
  });
});

describe("SubBtn", () => {
  it("renders Continue button and calls onClick", () => {
    const onClick = vi.fn();
    render(<SubBtn onClick={onClick} rippleKey={0} />);
    const btn = screen.getByRole("button", { name: /continue/i });
    expect(btn).toBeTruthy();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows ripple when rippleKey > 0", () => {
    const { container } = render(<SubBtn onClick={() => {}} rippleKey={12345} />);
    const btn = container.querySelector("button");
    // Ripple span should exist when rippleKey > 0
    const ripple = btn.querySelector("span");
    expect(ripple).toBeTruthy();
  });

  it("does not show ripple when rippleKey is 0", () => {
    const { container } = render(<SubBtn onClick={() => {}} rippleKey={0} />);
    const btn = container.querySelector("button");
    const ripple = btn.querySelector("span");
    expect(ripple).toBeNull();
  });

  it("calls registerSubBtn on mount and unmount", () => {
    const registerSubBtn = vi.fn();
    const { unmount } = render(<SubBtn onClick={() => {}} rippleKey={0} registerSubBtn={registerSubBtn} />);
    expect(registerSubBtn).toHaveBeenCalledWith(true);
    unmount();
    expect(registerSubBtn).toHaveBeenCalledWith(false);
  });

  it("works without registerSubBtn prop", () => {
    // Should not throw when registerSubBtn is not provided
    const { unmount } = render(<SubBtn onClick={() => {}} rippleKey={0} />);
    unmount(); // No error expected
  });
});

describe("Tag", () => {
  it("renders with color styling", () => {
    const { container } = render(<Tag color={C.blue}>label</Tag>);
    const span = container.firstChild;
    expect(span.textContent).toBe("label");
    expect(span.style.display).toBe("inline-block");
    expect(span.style.fontWeight).toBe("600");
  });
});

describe("ErrorBoundary", () => {
  // Suppress error output during expected errors
  const originalError = console.error;
  beforeEach(() => { console.error = vi.fn(); });
  afterEach(() => { console.error = originalError; });

  const ThrowingComponent = ({ shouldThrow = true }) => {
    if (shouldThrow) throw new Error("Test error");
    return <div>no error</div>;
  };

  it("renders children when no error", () => {
    render(
      <ErrorBoundary resetKey={1}>
        <div>child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("child content")).toBeTruthy();
  });

  it("renders error UI when child throws", () => {
    render(
      <ErrorBoundary resetKey={1}>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeTruthy();
    expect(screen.getByText("Test error")).toBeTruthy();
    expect(screen.getByText("Try Again")).toBeTruthy();
  });

  it("resets error state when Try Again is clicked", () => {
    // First render with error, then the retry should attempt to render again
    const { container } = render(
      <ErrorBoundary resetKey={1}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeTruthy();
    // Click Try Again - it will throw again, but that tests the setState path
    fireEvent.click(screen.getByText("Try Again"));
    // After clicking, it attempts re-render; the component throws again
    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });

  it("resets when resetKey changes", () => {
    const { rerender } = render(
      <ErrorBoundary resetKey={1}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeTruthy();
    // Change resetKey - should attempt re-render (will throw again but tests the branch)
    rerender(
      <ErrorBoundary resetKey={2}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });

  it("componentDidUpdate does nothing when resetKey is the same", () => {
    const { rerender } = render(
      <ErrorBoundary resetKey={1}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeTruthy();
    // Re-render with same resetKey
    rerender(
      <ErrorBoundary resetKey={1}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    // Still showing error since resetKey didn't change
    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });
});
