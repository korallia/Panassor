import OrnamentDivider from "../../ui/OrnamentDivider";
import PanassorSectionHeader from "../../layout/PanassorSectionHeader";

function AtelierVideosSection({ children }) {
  return (
    <section className="relative overflow-hidden bg-[#080504] px-6 pt-8 pb-24 text-[#f3e7cf]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(35,72,40,0.22),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,155,60,0.12),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-[92rem]">
        <PanassorSectionHeader
          eyebrow="Vidéos d’atelier"
          title="Voir la vision Panassor"
          showAtmosphere={false}
          showTitleDivider={false}
          showOrnament={true}
          ornamentClassName="mt-7"
          className="mx-auto mb-16 max-w-[78rem]"
        />

        {children}

        <OrnamentDivider className="mx-auto mt-20" width={112} opacity={0.55} />
      </div>
    </section>
  );
}

export default AtelierVideosSection;