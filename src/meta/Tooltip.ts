/**
 * Dismissable Tooltip Component
 * Shows helpful hints to users that can be permanently dismissed
 */

export interface TooltipOptions {
  /** Unique identifier for this tooltip (used for localStorage) */
  id: string;
  /** The message to display in the tooltip */
  message: string;
  /** Position relative to target: 'top' | 'bottom' | 'left' | 'right' */
  position?: "top" | "bottom" | "left" | "right";
  /** Arrow position: 'start' | 'center' | 'end' */
  arrowPosition?: "start" | "center" | "end";
  /** Auto-dismiss after N milliseconds (0 = manual dismiss only) */
  autoDismiss?: number;
  /** Delay before showing tooltip (ms) */
  delay?: number;
}

export class Tooltip {
  private element: HTMLElement;
  private targetElement: HTMLElement;
  private options: Required<TooltipOptions>;
  private storageKey: string;
  private dismissed = false;

  constructor(targetElement: HTMLElement, options: TooltipOptions) {
    this.targetElement = targetElement;
    this.options = {
      position: options.position || "top",
      arrowPosition: options.arrowPosition || "center",
      autoDismiss: options.autoDismiss || 0,
      delay: options.delay || 0,
      ...options,
    };
    this.storageKey = `tooltip-dismissed-${this.options.id}`;

    // Create tooltip element
    this.element = this.createTooltipElement();

    // Check if already dismissed
    const wasDismissed = this.wasDismissed();
    console.log(
      `Tooltip ${this.options.id}: wasDismissed=${wasDismissed}, storageKey=${this.storageKey}`,
    );

    if (wasDismissed) {
      this.dismissed = true;
      return;
    }

    // Show tooltip after delay
    if (this.options.delay > 0) {
      console.log(
        `Tooltip ${this.options.id}: will show after ${this.options.delay}ms`,
      );
      setTimeout(() => this.show(), this.options.delay);
    } else {
      this.show();
    }
  }

  private createTooltipElement(): HTMLElement {
    const tooltip = document.createElement("div");
    tooltip.className = `tooltip tooltip-${this.options.position}`;
    tooltip.setAttribute("data-tooltip-id", this.options.id);

    const content = document.createElement("div");
    content.className = "tooltip-content";
    content.innerHTML = this.options.message;

    const closeBtn = document.createElement("button");
    closeBtn.className = "tooltip-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Dismiss tooltip");
    closeBtn.addEventListener("click", () => this.dismiss());

    const arrow = document.createElement("div");
    arrow.className = `tooltip-arrow tooltip-arrow-${this.options.arrowPosition}`;

    tooltip.appendChild(content);
    tooltip.appendChild(closeBtn);
    tooltip.appendChild(arrow);

    return tooltip;
  }

  private show(): void {
    if (this.dismissed) return;

    console.log(`Tooltip ${this.options.id}: showing now`);

    // Add tooltip to target element
    this.targetElement.style.position = "relative";
    this.targetElement.appendChild(this.element);

    // Trigger animation
    requestAnimationFrame(() => {
      this.element.classList.add("tooltip-visible");
      console.log(`Tooltip ${this.options.id}: animation triggered`);
    });

    // Auto-dismiss if configured
    if (this.options.autoDismiss > 0) {
      setTimeout(() => this.dismiss(), this.options.autoDismiss);
    }
  }

  public dismiss(): void {
    if (this.dismissed) return;

    this.dismissed = true;
    this.element.classList.remove("tooltip-visible");
    this.element.classList.add("tooltip-hiding");

    // Mark as dismissed in localStorage
    localStorage.setItem(this.storageKey, "true");

    // Remove from DOM after animation
    setTimeout(() => {
      if (this.element.parentElement) {
        this.element.parentElement.removeChild(this.element);
      }
    }, 300);
  }

  private wasDismissed(): boolean {
    return localStorage.getItem(this.storageKey) === "true";
  }

  public static dismissAll(tooltipId: string): void {
    const storageKey = `tooltip-dismissed-${tooltipId}`;
    localStorage.setItem(storageKey, "true");

    // Remove all visible tooltips with this ID
    document
      .querySelectorAll(`[data-tooltip-id="${tooltipId}"]`)
      .forEach((el) => {
        el.classList.remove("tooltip-visible");
        el.classList.add("tooltip-hiding");
        setTimeout(() => {
          if (el.parentElement) {
            el.parentElement.removeChild(el);
          }
        }, 300);
      });
  }

  public static reset(tooltipId: string): void {
    const storageKey = `tooltip-dismissed-${tooltipId}`;
    localStorage.removeItem(storageKey);
  }

  public static resetAll(): void {
    // Remove all tooltip dismissal states
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("tooltip-dismissed-")) {
        localStorage.removeItem(key);
      }
    });
  }
}
