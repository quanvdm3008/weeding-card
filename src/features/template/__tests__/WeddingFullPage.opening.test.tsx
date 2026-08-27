// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { templates } from "@/data/templates";
import { templateExperiences } from "@/data/templateExperiences";
import WeddingFullPage from "../WeddingFullPage";

afterEach(cleanup);

describe("WeddingFullPage opening flow", () => {
  it("gives every template a distinct opening identity", () => {
    const identities = templates.map((template) => `${template.id}:${templateExperiences[template.id].opening}`);
    expect(new Set(identities).size).toBe(templates.length);
  });

  it.each(templates)("shows the opening before %s starts", (template) => {
    render(
      <WeddingFullPage
        templateId={template.id}
        groomName="Minh"
        brideName="Hà"
        date="2027-02-14"
        time="17:30"
        venue="White Palace"
        address="TP. Hồ Chí Minh"
      />,
    );

    expect(document.querySelector(`[data-template-opening="${template.id}"]`)).not.toBeNull();
    expect(screen.queryByTestId("opening-open")).not.toBeNull();
  });
});
