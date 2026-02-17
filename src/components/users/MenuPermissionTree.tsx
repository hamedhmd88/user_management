import React, { useRef } from "react";
import type { Menu } from "../../types";

interface Props {
  menus: Menu[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
}

export default function MenuPermissionTree({ menus, selectedIds, onChange, disabled }: Props) {
  const isSelected = (id: number) => selectedIds.includes(id);

  function toggleSub(id: number) {
    if (disabled) return;
    onChange(isSelected(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  }

  function toggleMenu(menu: Menu) {
    if (disabled) return;
    const subIds = menu.submenus.map((s) => s.id);
    const allSel = subIds.every(isSelected);
    onChange(allSel
      ? selectedIds.filter((id) => !subIds.includes(id))
      : [...selectedIds, ...subIds.filter((id) => !isSelected(id))]
    );
  }

  if (!menus.length) return <p className="text-sm text-custom-muted">هیچ منویی یافت نشد.</p>;

  return (
    <div className="border border-custom-border rounded-lg overflow-hidden divide-y divide-custom-border">
      {menus.map((menu) => {
        const subIds = menu.submenus.map((s) => s.id);
        const allChecked = subIds.length > 0 && subIds.every(isSelected);
        const someChecked = subIds.some(isSelected);

        return (
          <div key={menu.id}>
            {/* Parent */}
            <div className="flex items-center gap-3 px-4 py-3 bg-custom-hover">
              {subIds.length > 0 && (
                <IndetermCheckbox
                  checked={allChecked}
                  indeterminate={someChecked && !allChecked}
                  onChange={() => toggleMenu(menu)}
                  disabled={disabled}
                />
              )}
              <span className="text-sm font-semibold text-custom-text">
                {menu.title || menu.name || `منو ${menu.id}`}
              </span>
              {subIds.length > 0 && (
                <span className="mr-auto text-xs text-custom-muted">
                  {subIds.filter(isSelected).length}/{subIds.length}
                </span>
              )}
            </div>
            {/* Submenus */}
            <div className="divide-y divide-custom-border">
              {menu.submenus.map((sub) => (
                <label
                  key={sub.id}
                  className={`flex items-center gap-3 px-6 py-2.5 hover:bg-custom-hover transition-colors ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected(sub.id)}
                    onChange={() => toggleSub(sub.id)}
                    disabled={disabled}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-custom-text">
                    {sub.title || sub.name || `زیرمنو ${sub.id}`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IndetermCheckbox({
  checked, indeterminate, onChange, disabled,
}: {
  checked: boolean; indeterminate: boolean;
  onChange: () => void; disabled?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref} type="checkbox"
      checked={checked} onChange={onChange}
      disabled={disabled}
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
    />
  );
}