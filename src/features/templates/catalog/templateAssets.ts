import boho from "@/assets/template-boho.jpg";
import garden from "@/assets/template-garden.jpg";
import minimalist from "@/assets/template-minimalist.jpg";
import modern from "@/assets/template-modern.jpg";
import romantic from "@/assets/template-romantic.jpg";
import royal from "@/assets/template-royal.jpg";
import rustic from "@/assets/template-rustic.jpg";
import sakura from "@/assets/template-sakura.jpg";
import tropical from "@/assets/template-tropical.jpg";
import vintage from "@/assets/template-vintage.jpg";
import nordicAurora from "@/assets/template-nordic-aurora.jpg";
import neoTokyo from "@/assets/template-neo-tokyo.jpg";
import coupleOne from "@/assets/couple-1.jpg";
import coupleTwo from "@/assets/couple-2.jpg";
import coupleThree from "@/assets/couple-3.jpg";
import proposal from "@/assets/couple-proposal.jpg";
import hero from "@/assets/hero-wedding.jpg";
import rings from "@/assets/rings.jpg";
import venue from "@/assets/venue.jpg";
import parallaxLove from "@/assets/template-parallax-love.png";
import violetDream from "@/assets/template-violet-dream-v2.png";

// New premium mockups
import canvasMockup from "@/assets/template-canvas-mockup.jpg";
import coastalMockup from "@/assets/template-coastal-mockup.jpg";
import cosmicMockup from "@/assets/template-cosmic-mockup.jpg";
import flat2dMockup from "@/assets/template-flat2d-mockup.jpg";
import koreanMockup from "@/assets/template-korean-mockup.jpg";
import layered3dMockup from "@/assets/template-layered3d-mockup.jpg";
import luxuryMockup from "@/assets/template-luxury-mockup.jpg";
import magazineMockup from "@/assets/template-magazine-mockup.jpg";
import photo25dMockup from "@/assets/template-photo25d-mockup.jpg";
import pixelMockup from "@/assets/template-pixel-mockup.jpg";
import traditionalMockup from "@/assets/template-traditional-mockup.jpg";
import winterMockup from "@/assets/template-winter-mockup.jpg";

const templateImages: Record<string, string> = {
  romantic,
  modern,
  tropical,
  rustic,
  sakura,
  minimalist,
  vintage,
  boho,
  royal,
  garden,
  canvas: canvasMockup,
  flat2d: flat2dMockup,
  layered3d: layered3dMockup,
  photo25d: photo25dMockup,
  cosmic: cosmicMockup,
  pixel: pixelMockup,
  korean: koreanMockup,
  magazine: magazineMockup,
  traditional: traditionalMockup,
  luxury: luxuryMockup,
  cyberpunk_luxe: neoTokyo,
  nordic_aurora: nordicAurora,
  coastal: coastalMockup,
  winter: winterMockup,
  violet_dream: violetDream,
  parallax_love: parallaxLove,
};

const moodImages: Record<string, string> = {
  romantic: proposal,
  modern: venue,
  tropical: hero,
  rustic: coupleOne,
  sakura: coupleThree,
  minimalist: rings,
  vintage: coupleTwo,
  boho: proposal,
  royal: venue,
  garden: coupleOne,
  canvas: rings,
  flat2d: coupleTwo,
  layered3d: coupleOne,
  photo25d: proposal,
  cosmic: venue,
  pixel: coupleTwo,
  korean: coupleThree,
  magazine: venue,
  traditional: proposal,
  luxury: venue,
  cyberpunk_luxe: venue,
  nordic_aurora: coupleThree,
  coastal: venue,
  winter: rings,
  violet_dream: coupleTwo,
  parallax_love: coupleOne,
};

export function getTemplateImage(templateId: string) {
  return templateImages[templateId] ?? hero;
}

export function getTemplateMoodImage(templateId: string) {
  return moodImages[templateId] ?? proposal;
}
