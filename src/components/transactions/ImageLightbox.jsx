const ImageLightbox = ({ lightboxUrl, setLightboxUrl }) => {
  if (!lightboxUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
      onClick={() => setLightboxUrl(null)}
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        onClick={() => setLightboxUrl(null)}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <img
        src={lightboxUrl}
        alt="Document"
        className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImageLightbox;
