type AdminNavProps = {
  title: string;
  description: string;
};

export function AdminNav({ title, description }: AdminNavProps) {
  return (
    <section className="admin-header">
      <div>
        <div className="eyebrow">Admin</div>
        <h1 className="title">{title}</h1>
        <p className="muted">{description}</p>
      </div>
    </section>
  );
}
