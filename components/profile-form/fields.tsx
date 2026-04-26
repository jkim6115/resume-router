import type { ReactNode } from "react";

export function EditableSection({
  title,
  description,
  addLabel,
  onAdd,
  children,
}: {
  title: string;
  description: string;
  addLabel?: string;
  onAdd?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="form-section">
      <div className="toolbar">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="muted">{description}</p>
        </div>
        {addLabel && onAdd ? (
          <button className="button" type="button" onClick={onAdd}>
            {addLabel}
          </button>
        ) : null}
      </div>
      <div className="stack">{children}</div>
    </section>
  );
}

export function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="label">
      {label}
      <input
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function MonthField({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="label">
      {label}
      <input
        className="input"
        type="month"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="label">
      {label}
      <textarea
        className="textarea large-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
