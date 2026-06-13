function ProductPanelTitle({ collectionName, productName, description }) {
  return (
    <>
      <div className="mb-7 flex w-60 max-w-full items-center gap-4 text-[#c89b3c]">
        <div className="h-px flex-1 bg-[#c89b3c]/70" />

        <span className="font-['IM_Fell_English_SC'] text-[0.72rem] uppercase tracking-[0.24em] text-[#c89b3c]">
          {collectionName}
        </span>

        <div className="h-px flex-1 bg-[#c89b3c]/70" />
      </div>

      <h1 className="font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] transition duration-300 group-hover:text-[#e7c97b] md:text-5xl">
        {productName}
      </h1>

      {description && (
        <p className="mt-6 max-w-[360px] font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/84">
          {description}
        </p>
      )}
    </>
  );
}

export default ProductPanelTitle;