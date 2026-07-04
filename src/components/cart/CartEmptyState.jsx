import OrnamentDivider from "../ui/OrnamentDivider";

function CartEmptyState({ copy }) {
  return (
    <div className="flex min-h-[26rem] flex-col items-center justify-center text-center">
      <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.24em] text-[#c89b3c]">
        {copy.title}
      </p>

      <OrnamentDivider className="my-5" width={96} opacity={0.5} />

      <p className="max-w-sm font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/82">
        {copy.text}
      </p>
    </div>
  );
}

export default CartEmptyState;