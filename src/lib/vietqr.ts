/**
 * VietQR Integration Utility (NAPAS 247 Standard)
 * Supports dynamic QR generation for Vietnamese banks.
 */

export interface VietnamBankItem {
  bin: string;
  code: string;
  shortName: string;
  name: string;
  logo?: string;
}

export const VIETNAM_BANKS_CATALOG: VietnamBankItem[] = [
  { bin: "970422", code: "MB", shortName: "MB Bank", name: "Ngân hàng TMCP Quân đội" },
  { bin: "970436", code: "VCB", shortName: "Vietcombank", name: "Ngân hàng TMCP Ngoại thương Việt Nam" },
  { bin: "970407", code: "TCB", shortName: "Techcombank", name: "Ngân hàng TMCP Kỹ thương Việt Nam" },
  { bin: "970415", code: "CTG", shortName: "VietinBank", name: "Ngân hàng TMCP Công thương Việt Nam" },
  { bin: "970418", code: "BIDV", shortName: "BIDV", name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam" },
  { bin: "970416", code: "ACB", shortName: "ACB", name: "Ngân hàng TMCP Á Châu" },
  { bin: "970423", code: "TPB", shortName: "TPBank", name: "Ngân hàng TMCP Tiên Phong" },
  { bin: "970432", code: "VPB", shortName: "VPBank", name: "Ngân hàng TMCP Việt Nam Thịnh Vượng" },
  { bin: "970403", code: "STB", shortName: "Sacombank", name: "Ngân hàng TMCP Sài Gòn Thương Tín" },
  { bin: "970441", code: "VIB", shortName: "VIB", name: "Ngân hàng TMCP Quốc tế Việt Nam" },
  { bin: "970405", code: "VBA", shortName: "Agribank", name: "Ngân hàng Nông nghiệp và PT Nông thôn Việt Nam" },
  { bin: "970437", code: "HDB", shortName: "HDBank", name: "Ngân hàng TMCP Phát triển TP.HCM" },
  { bin: "970448", code: "OCB", shortName: "OCB", name: "Ngân hàng TMCP Phương Đông" },
  { bin: "970431", code: "EIB", shortName: "Eximbank", name: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam" },
  { bin: "970426", code: "MSB", shortName: "MSB", name: "Ngân hàng TMCP Hàng Hải Việt Nam" },
  { bin: "970454", code: "VCCB", shortName: "BVBank", name: "Ngân hàng TMCP Bản Việt" },
  { bin: "970429", code: "SCB", shortName: "SCB", name: "Ngân hàng TMCP Sài Gòn" },
  { bin: "970443", code: "SHB", shortName: "SHB", name: "Ngân hàng TMCP Sài Gòn - Hà Nội" },
  { bin: "970440", code: "SEAB", shortName: "SeABank", name: "Ngân hàng TMCP Đông Nam Á" },
  { bin: "970452", code: "LPB", shortName: "LPBank", name: "Ngân hàng TMCP Lộc Phát Việt Nam" },
];

export interface VietQrOptions {
  bankBin?: string;
  bankName?: string;
  accountNumber: string;
  accountHolder?: string;
  amount?: number | string;
  description?: string;
  template?: "compact2" | "compact" | "qr_only" | "print";
}

/**
 * Finds matching bank BIN from bank name or code.
 */
export function resolveBankBin(bankIdentifier: string | undefined): string | undefined {
  if (!bankIdentifier?.trim()) return undefined;
  const clean = bankIdentifier.trim().toLowerCase();
  const found = VIETNAM_BANKS_CATALOG.find(
    (b) =>
      b.bin === clean ||
      b.code.toLowerCase() === clean ||
      b.shortName.toLowerCase() === clean ||
      b.name.toLowerCase() === clean ||
      clean.includes(b.shortName.toLowerCase()) ||
      clean.includes(b.code.toLowerCase())
  );
  return found?.bin ?? found?.code;
}

/**
 * Generate a high-resolution VietQR image URL.
 */
export function generateVietQrUrl({
  bankBin,
  bankName,
  accountNumber,
  accountHolder,
  amount,
  description,
  template = "compact2",
}: VietQrOptions): string {
  if (!accountNumber?.trim()) return "";

  const bin = bankBin || resolveBankBin(bankName) || bankName?.trim();
  if (!bin) return "";

  const cleanAccount = accountNumber.replace(/\s+/g, "");
  const base = `https://img.vietqr.io/image/${bin}-${cleanAccount}-${template}.png`;
  const params = new URLSearchParams();

  if (accountHolder?.trim()) {
    params.set("accountName", accountHolder.trim().toUpperCase());
  }
  if (amount && Number(amount) > 0) {
    params.set("amount", String(amount));
  }
  if (description?.trim()) {
    params.set("addInfo", description.trim());
  }

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/**
 * Compatibility helper for existing templates calling getVietQrImageUrl.
 */
export function getVietQrImageUrl(
  bankOrOptions?: string | VietQrOptions,
  accountNumber?: string,
  accountHolder?: string,
  amount?: number | string,
  description?: string,
  template?: "compact2" | "compact" | "qr_only" | "print"
): string {
  if (typeof bankOrOptions === "object" && bankOrOptions !== null) {
    return generateVietQrUrl(bankOrOptions);
  }
  return generateVietQrUrl({
    bankName: bankOrOptions,
    accountNumber: accountNumber || "",
    accountHolder,
    amount,
    description,
    template,
  });
}
