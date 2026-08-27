import { describe, expect, it } from "vitest";
import { executeCommand, mutationCommand, redoSnapshot, undoSnapshot } from "../commands";

describe("editor command history", () => {
  it("executes, undoes and redoes a document command", () => {
    const initial = { title: "Draft", count: 0 };
    const executed = executeCommand(
      { present: initial, past: [], future: [] },
      mutationCommand("increment", (document) => ({ ...document, count: document.count + 1 })),
    );

    expect(executed.present.count).toBe(1);
    const undone = undoSnapshot(executed);
    expect(undone.present).toEqual(initial);
    const redone = redoSnapshot(undone);
    expect(redone.present.count).toBe(1);
  });

  it("does not create history for a no-op command", () => {
    const initial = { value: "same" };
    const result = executeCommand(
      { present: initial, past: [], future: [] },
      mutationCommand("noop", (document) => document),
    );
    expect(result.past).toEqual([]);
    expect(result.present).toBe(initial);
  });
});
