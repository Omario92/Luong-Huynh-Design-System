// FilterRow.jsx — portfolio category filter (single-select pills).
function FilterRow({ active, onChange }) {
  const { categories } = window.LH_DATA;
  return (
    <div className="lh-filter-row" role="tablist">
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          role="tab"
          aria-selected={active === c}
          className={"lh-filter-pill" + (active === c ? " is-active" : "")}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

window.FilterRow = FilterRow;
