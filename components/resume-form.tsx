import { Save } from "lucide-react";

type ResumeFormProps = {
  mode: "create" | "edit";
  action: (formData: FormData) => void | Promise<void>;
  initialValues?: {
    id?: string;
    companyName?: string;
    selfIntroduction?: string;
    motivation?: string;
    notes?: string | null;
  };
};

export function ResumeForm({ mode, action, initialValues }: ResumeFormProps) {
  if (mode === "create") {
    return (
      <form className="form" action={action}>
        <label className="label">
          회사명
          <input
            className="input"
            name="companyName"
            defaultValue={initialValues?.companyName || ""}
            required
          />
        </label>

        <label className="label">
          기업별 자기소개
          <textarea
            className="textarea compact-textarea"
            name="selfIntroduction"
            defaultValue={initialValues?.selfIntroduction || ""}
            required
          />
        </label>

        <label className="label">
          지원동기
          <textarea
            className="textarea compact-textarea"
            name="motivation"
            defaultValue={initialValues?.motivation || ""}
            required
          />
        </label>

        <div className="actions align-end sticky-actions">
          <button
            className="button primary save-floating-button"
            type="submit"
            aria-label="자동 ID로 생성하기"
            data-tooltip="자동 ID로 생성하기"
          >
            <Save className="icon" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className="form" action={action}>
      <div className="grid two">
        <label className="label">
          6자리 ID
          <input
            className="input"
            name="id"
            maxLength={6}
            defaultValue={initialValues?.id || ""}
            readOnly
            required
          />
        </label>
        <label className="label">
          회사명
          <input
            className="input"
            name="companyName"
            defaultValue={initialValues?.companyName || ""}
            required
          />
        </label>
      </div>

      <label className="label">
        자기소개
        <textarea
          className="textarea compact-textarea"
          name="selfIntroduction"
          defaultValue={initialValues?.selfIntroduction || ""}
          required
        />
      </label>

      <label className="label">
        지원동기
        <textarea
          className="textarea compact-textarea"
          name="motivation"
          defaultValue={initialValues?.motivation || ""}
          required
        />
      </label>

      <label className="label">
        메모
        <textarea className="textarea compact-textarea" name="notes" defaultValue={initialValues?.notes || ""} />
      </label>

      <div className="actions align-end sticky-actions">
        <button
          className="button primary save-floating-button"
          type="submit"
          aria-label="수정 저장"
          data-tooltip="수정 저장"
        >
          <Save className="icon" />
        </button>
      </div>
    </form>
  );
}
