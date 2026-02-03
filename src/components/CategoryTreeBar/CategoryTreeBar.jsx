import { useMemo, useState } from 'react';
import './CategoryTreeBar.css';

function findPathToNode(nodes, targetId, acc = []) {
  for (const n of nodes) {
    const nextAcc = [...acc, n];
    if (n.id === targetId) return nextAcc;
    if (n.children?.length) {
      const found = findPathToNode(n.children, targetId, nextAcc);
      if (found) return found;
    }
  }
  return null;
}

export default function CategoryTreeBar({
  tree,
  selectedId,
  onSelect,
}) {
  const selectedPath = useMemo(() => {
    if (!selectedId) return [];
    return findPathToNode(tree, selectedId) || [];
  }, [tree, selectedId]);

  const currentNodes = useMemo(() => {
    if (!selectedId) return tree;
    const last = selectedPath[selectedPath.length - 1];
    if (last?.children?.length) return last.children;

    const parent = selectedPath.length >= 2
      ? selectedPath[selectedPath.length - 2]
      : null;

    if (parent?.children?.length) return parent.children;
    return tree;
  }, [tree, selectedId, selectedPath]);

  const crumbs = useMemo(() => {
    return selectedPath.map(p => ({ id: p.id, name: p.name }));
  }, [selectedPath]);

  const handleSelect = (id) => {
    onSelect?.(id);
  };

  return (
    <div className="category-treebar">
      <div className="ctb-header">
        <div className="ctb-crumbs">
          <button
            type="button"
            className={`ctb-crumb ${!selectedId ? 'active' : ''}`}
            onClick={() => handleSelect(null)}
          >
            Все категории
          </button>
          {crumbs.map((c, idx) => (
            <span key={c.id} className="ctb-crumb-separator">›</span>
          ))}
          {crumbs.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              className={`ctb-crumb ${idx === crumbs.length - 1 ? 'active' : ''}`}
              onClick={() => handleSelect(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="categories-section">
        <div className="categories-scroll">
          {currentNodes.map(cat => (
            <div
              key={cat.id}
              className={`category-tile ${selectedId === cat.id ? 'active' : ''}`}
              onClick={() => handleSelect(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(cat.id)}
            >
              <div className="tile-media">
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="tile-img"
                  />
                ) : (
                  <span className="tile-emoji">👕</span>
                )}
                {cat.children?.length ? (
                  <span className="ctb-has-children">›</span>
                ) : null}
              </div>
              <span className="tile-label">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
