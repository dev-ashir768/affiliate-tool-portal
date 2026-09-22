"use client";

import { useId, useMemo } from "react";
import Select, {
  type GroupBase,
  type Props as ReactSelectProps,
  type StylesConfig,
  type ThemeConfig,
  components,
} from "react-select";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "cn";

export type SelectOption<T = string> = {
  value: T;
  label: string;
  isDisabled?: boolean;
};

function readCssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

function useShadcnSelectStyles<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(size: "sm" | "default"): StylesConfig<Option, IsMulti, Group> {
  return useMemo(() => {
    const radius =
      size === "sm"
        ? "min(var(--radius-md, 0.5rem), 10px)"
        : "var(--radius-lg, 0.5rem)";
    const minHeight = size === "sm" ? "1.75rem" : "2rem";
    const fontSize = "0.875rem";

    return {
      container: (base) => ({
        ...base,
        fontSize,
      }),
      control: (base, state) => ({
        ...base,
        minHeight,
        height: "auto",
        borderRadius: radius,
        borderColor: state.isFocused
          ? "var(--ring)"
          : "var(--input)",
        backgroundColor: "var(--background)",
        boxShadow: state.isFocused
          ? "0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent)"
          : "none",
        "&:hover": {
          borderColor: state.isFocused ? "var(--ring)" : "var(--input)",
        },
        cursor: state.isDisabled ? "not-allowed" : "default",
        opacity: state.isDisabled ? 0.5 : 1,
        transition: "color 150ms, border-color 150ms, box-shadow 150ms",
      }),
      valueContainer: (base) => ({
        ...base,
        padding: size === "sm" ? "0 0.5rem" : "0 0.625rem",
      }),
      input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
        color: "var(--foreground)",
      }),
      singleValue: (base) => ({
        ...base,
        color: "var(--foreground)",
        margin: 0,
      }),
      placeholder: (base) => ({
        ...base,
        color: "var(--muted-foreground)",
        margin: 0,
      }),
      indicatorsContainer: (base) => ({
        ...base,
        height: minHeight,
      }),
      dropdownIndicator: (base) => ({
        ...base,
        padding: size === "sm" ? "0 0.35rem" : "0 0.45rem",
        color: "var(--muted-foreground)",
        "&:hover": { color: "var(--foreground)" },
      }),
      clearIndicator: (base) => ({
        ...base,
        padding: size === "sm" ? "0 0.25rem" : "0 0.35rem",
        color: "var(--muted-foreground)",
        "&:hover": { color: "var(--foreground)" },
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 60,
        marginTop: 4,
        borderRadius: "var(--radius-lg, 0.5rem)",
        backgroundColor: "var(--popover)",
        color: "var(--popover-foreground)",
        boxShadow:
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        border: "1px solid color-mix(in oklab, var(--foreground) 10%, transparent)",
        overflow: "hidden",
      }),
      menuPortal: (base) => ({
        ...base,
        zIndex: 70,
      }),
      menuList: (base) => ({
        ...base,
        padding: 4,
        maxHeight: 280,
      }),
      option: (base, state) => ({
        ...base,
        borderRadius: "var(--radius-md, 0.375rem)",
        fontSize,
        padding: "0.35rem 0.5rem",
        cursor: state.isDisabled ? "not-allowed" : "default",
        backgroundColor: state.isSelected
          ? "var(--accent)"
          : state.isFocused
            ? "var(--accent)"
            : "transparent",
        color: state.isSelected || state.isFocused
          ? "var(--accent-foreground)"
          : "var(--popover-foreground)",
        opacity: state.isDisabled ? 0.5 : 1,
        ":active": {
          backgroundColor: "var(--accent)",
          color: "var(--accent-foreground)",
        },
      }),
      noOptionsMessage: (base) => ({
        ...base,
        color: "var(--muted-foreground)",
        fontSize,
      }),
      multiValue: (base) => ({
        ...base,
        backgroundColor: "var(--muted)",
        borderRadius: "var(--radius-md, 0.375rem)",
      }),
      multiValueLabel: (base) => ({
        ...base,
        color: "var(--foreground)",
        fontSize: "0.75rem",
      }),
      multiValueRemove: (base) => ({
        ...base,
        color: "var(--muted-foreground)",
        borderRadius: "var(--radius-md, 0.375rem)",
        ":hover": {
          backgroundColor: "var(--destructive)",
          color: "white",
        },
      }),
    };
  }, [size]);
}

function DropdownIndicator<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(props: React.ComponentProps<typeof components.DropdownIndicator<Option, IsMulti, Group>>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDownIcon className="size-4 text-muted-foreground" />
    </components.DropdownIndicator>
  );
}

export type AppReactSelectProps<
  Option extends SelectOption<string | number> = SelectOption,
  IsMulti extends boolean = false,
> = Omit<
  ReactSelectProps<Option, IsMulti, GroupBase<Option>>,
  "theme" | "styles" | "classNames"
> & {
  size?: "sm" | "default";
  className?: string;
  /** Use when select is inside overflow:hidden (tables, dialogs). */
  portalMenu?: boolean;
};

export function AppReactSelect<
  Option extends SelectOption<string | number> = SelectOption,
  IsMulti extends boolean = false,
>({
  size = "default",
  className,
  portalMenu = false,
  components: userComponents,
  ...props
}: AppReactSelectProps<Option, IsMulti>) {
  const instanceId = useId();
  const styles = useShadcnSelectStyles<Option, IsMulti, GroupBase<Option>>(size);

  const theme: ThemeConfig = (base) => ({
    ...base,
    borderRadius: 8,
    colors: {
      ...base.colors,
      primary: readCssVar("--primary", base.colors.primary),
      primary75: readCssVar("--accent", base.colors.primary75),
      primary50: readCssVar("--accent", base.colors.primary50),
      primary25: readCssVar("--muted", base.colors.primary25),
      danger: readCssVar("--destructive", base.colors.danger),
      dangerLight: readCssVar("--muted", base.colors.dangerLight),
      neutral0: readCssVar("--background", base.colors.neutral0),
      neutral5: readCssVar("--muted", base.colors.neutral5),
      neutral10: readCssVar("--muted", base.colors.neutral10),
      neutral20: readCssVar("--border", base.colors.neutral20),
      neutral30: readCssVar("--border", base.colors.neutral30),
      neutral40: readCssVar("--muted-foreground", base.colors.neutral40),
      neutral50: readCssVar("--muted-foreground", base.colors.neutral50),
      neutral60: readCssVar("--muted-foreground", base.colors.neutral60),
      neutral70: readCssVar("--foreground", base.colors.neutral70),
      neutral80: readCssVar("--foreground", base.colors.neutral80),
      neutral90: readCssVar("--foreground", base.colors.neutral90),
    },
  });

  return (
    <div className={cn("min-w-0", className)}>
      <Select<Option, IsMulti, GroupBase<Option>>
        instanceId={instanceId}
        styles={styles}
        theme={theme}
        menuPortalTarget={
          portalMenu && typeof document !== "undefined"
            ? document.body
            : undefined
        }
        menuPosition={portalMenu ? "fixed" : undefined}
        components={{
          DropdownIndicator,
          IndicatorSeparator: () => null,
          ...userComponents,
        }}
        classNamePrefix="app-rs"
        {...props}
      />
    </div>
  );
}

/** Convenience helper for controlled string value selects. */
export function stringSelectValue(
  options: SelectOption[],
  value: string | null | undefined,
): SelectOption | null {
  if (value == null || value === "") return null;
  return options.find((o) => o.value === value) ?? null;
}
