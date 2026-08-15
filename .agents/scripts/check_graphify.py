import sys
import os
import json
from pathlib import Path

def main():
    try:
        raw_input = sys.stdin.read()
        payload = json.loads(raw_input) if raw_input.strip() else {}
    except Exception:
        payload = {}

    # Prevent infinite loop if model repeatedly stops without updating
    execution_num = payload.get("executionNum", 1)
    if execution_num > 2:
        print(json.dumps({}))
        return

    workspace_paths = payload.get("workspacePaths", [])
    if workspace_paths:
        root_dir = Path(workspace_paths[0])
    else:
        root_dir = Path.cwd()
        if root_dir.name == ".agents":
            root_dir = root_dir.parent

    graph_file = root_dir / ".graphify" / "graph.md"

    ignore_dirs = {
        ".git", "node_modules", ".graphify", "graphify-out", "dist", "build", ".next",
        ".agents", ".gemini", ".turbo", ".cache", "coverage",
        "__pycache__", ".claude", ".github", ".vscode", ".idea"
    }

    if not graph_file.exists():
        msg = (
            ".graphify/graph.md dosyası mevcut değil. "
            "Lütfen graphify yönergelerine göre projenin bilgi grafiğini (knowledge graph) "
            ".graphify/graph.md dosyasına oluşturun."
        )
        print(json.dumps({"decision": "continue", "reason": msg}))
        return

    graph_mtime = graph_file.stat().st_mtime
    changed_files = []

    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in ignore_dirs and not d.startswith(".")]
        for file in files:
            if file.startswith(".") or file.endswith(".lock") or file.endswith("-lock.json"):
                continue
            file_path = Path(root) / file
            try:
                if file_path.stat().st_mtime > graph_mtime:
                    rel_path = file_path.relative_to(root_dir)
                    changed_files.append(str(rel_path))
            except OSError:
                continue

    if changed_files:
        sample_files = changed_files[:8]
        file_list_str = ", ".join(sample_files)
        if len(changed_files) > 8:
            file_list_str += f" ve {len(changed_files) - 8} diğer dosya"

        msg = (
            f"Şu proje dosyaları değiştirildi: {file_list_str}. "
            "Lütfen graphify kurallarına uygun olarak .graphify/graph.md dosyasındaki "
            "bilgi grafiğini (knowledge graph) sadece değişen dosyalar için artımsal (incremental) olarak güncelleyin."
        )
        print(json.dumps({"decision": "continue", "reason": msg}))
    else:
        print(json.dumps({}))

if __name__ == "__main__":
    main()
