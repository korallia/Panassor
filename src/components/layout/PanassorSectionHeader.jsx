import SectionAtmosphere from "../layout/SectionAtmosphere";
import SectionTitle from "../layout/SectionTitle";
import OrnamentDivider from "../ui/OrnamentDivider";

function PanassorSectionHeader({
  eyebrow,
  title,
  description,
  atmosphere = "collection",
  showAtmosphere = true,
  showTitleDivider = true,
  showOrnament = true,
  ornamentClassName = "mt-8",
  descriptionClassName = "",
  className = "",
  actions,
}) {
  return (
    <>
      {showAtmosphere && <SectionAtmosphere variant={atmosphere} />}

      <div className={`relative z-10 text-center ${className}`}>
        <div className="relative">
          <SectionTitle
            eyebrow={eyebrow}
            title={title}
            align="center"
            showDivider={showTitleDivider}
          />

          {actions && (
            <div className="mt-8 flex justify-center gap-3 md:absolute md:right-0 md:top-1/2 md:mt-0 md:-translate-y-1/2">
              {actions}
            </div>
          )}
        </div>

        {description && (
          <p
            className={`mx-auto mt-7 max-w-3xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/82 ${descriptionClassName}`}
          >
            {description}
          </p>
        )}

        {showOrnament && (
          <OrnamentDivider
            className={ornamentClassName}
            width={112}
            opacity={0.65}
          />
        )}
      </div>
    </>
  );
}

export default PanassorSectionHeader;