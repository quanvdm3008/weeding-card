// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GiftQrReveal } from "../GiftQrReveal";

describe("GiftQrReveal", () => {
  it("Hide the QR until the customer opens the gift bag", async () => {
    render(<GiftQrReveal qrSrc="data:image/png;base64,qr" buttonLabel="Open wedding gifts" />);

    expect(screen.queryByAltText("Wedding gift QR code")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /open wedding gifts/i }));
    expect(screen.getByAltText("Wedding gift QR code")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
