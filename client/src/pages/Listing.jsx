import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";
import { useSelector } from 'react-redux';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaCalendar,
  FaRuler,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaEye,
  FaClock,
  FaWifi,
  FaSnowflake,
  FaCar,
  FaTree,
} from 'react-icons/fa';

// Lazy load Contact component for better performance
const Contact = lazy(() => import("../Component/Contact"));

// Constants for better maintainability
const DARK_BLUE_BG = '#3B4856';

// Loading skeleton component
const LoadingSkeleton = React.memo(() => (
  <div className="animate-pulse min-h-screen" style={{ backgroundColor: DARK_BLUE_BG }}>
    <div className="h-14 bg-slate-700/30 border-b border-slate-600 mb-6"></div>
    <div className="h-[400px] md:h-[600px] bg-gradient-to-r from-slate-600/50 to-slate-500/50 mx-4 rounded-xl mb-6 relative overflow-hidden"></div>
    <div className="max-w-4xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-6 md:grid-cols-10 gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-12 bg-slate-600/50 rounded-lg"></div>
        ))}
      </div>
    </div>
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-slate-700/20 p-8 rounded-2xl border border-slate-600/50">
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="h-10 bg-slate-600/50 rounded-lg w-3/4 mb-4"></div>
            <div className="h-5 bg-slate-600/50 rounded-lg w-1/2 mb-6"></div>
            <div className="flex gap-3">
              <div className="h-10 bg-slate-600/50 rounded-full w-32"></div>
              <div className="h-10 bg-slate-600/50 rounded-full w-32"></div>
            </div>
          </div>
          <div className="w-full lg:w-80 h-32 bg-slate-600/50 rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
));

// Error message component
const ErrorMessage = React.memo(({ onRetry }) => (
  <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: DARK_BLUE_BG }}>
    <div className="max-w-lg mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-3">Property Not Found</h2>
      <p className="text-slate-300 mb-8">We couldn't locate this property.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={onRetry} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Try Again</button>
        <button onClick={() => window.history.back()} className="bg-slate-600 text-white px-6 py-3 rounded-lg">Go Back</button>
      </div>
    </div>
  </div>
));

// Price display
const PriceDisplay = React.memo(({ listing }) => {
  const price = useMemo(() => listing.offer ? listing.discountedPrice : listing.regularPrice, [listing]);
  return (
    <div className="relative bg-slate-800/60 p-8 rounded-2xl shadow-2xl">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-4xl font-black text-white">${Number(price).toLocaleString("en-US")}</span>
        {listing.type === 'rent' && <span className="text-slate-300 text-lg font-medium">/month</span>}
      </div>
    </div>
  );
});

// Property features
const PropertyFeatures = React.memo(({ listing }) => {
  const features = useMemo(() => [
    { icon: FaBed, value: listing.bedrooms, label: listing.bedrooms > 1 ? 'Bedrooms' : 'Bedroom' },
    { icon: FaBath, value: listing.bathrooms, label: listing.bathrooms > 1 ? 'Bathrooms' : 'Bathroom' },
    { icon: FaCar, value: listing.parking ? 'Available' : 'Not Available', label: 'Parking' },
    { icon: FaChair, value: listing.furnished ? 'Furnished' : 'Unfurnished', label: 'Furnishing' },
  ], [listing]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {features.map((feature, i) => (
        <div key={i} className="p-6 rounded-xl bg-slate-700 text-center">
          <feature.icon className="text-white text-xl mb-2" />
          <div className="font-bold text-white">{feature.value}</div>
          <div className="text-slate-300 text-sm">{feature.label}</div>
        </div>
      ))}
    </div>
  );
});

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();

  // ✅ Only keep ONE fetchListing
  const fetchListing = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await axios.get(`/api/listing/get/${params.listingId}`, { timeout: 10000 });
      setListing(res.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error("Failed to load property details.");
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [params.listingId]);

  useEffect(() => {
    if (params.listingId) {
      fetchListing();
    }
  }, [fetchListing]);

  const imageUrls = useMemo(() => listing?.imageUrls || [], [listing?.imageUrls]);

  if (loading) return <LoadingSkeleton />;
  if (error || !listing) return <ErrorMessage onRetry={fetchListing} />;

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: DARK_BLUE_BG }}>
      {/* Back button */}
      <div className="sticky top-0 bg-slate-800/40 p-4">
        <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2">
          <FaArrowLeft /> Back to listings
        </button>
      </div>

      {/* Image gallery */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
          className="h-[400px] md:h-[600px]"
        >
          {imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <img src={url} alt={`${listing.name} - ${index}`} className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Property details */}
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white">{listing.name}</h1>
        <div className="flex items-center gap-2 text-slate-300 mb-4">
          <FaMapMarkerAlt /> {listing.address}
        </div>
        <PriceDisplay listing={listing} />
        <PropertyFeatures listing={listing} />
        <p className="text-slate-300 mt-6">{listing.description}</p>

        {/* Contact */}
        {currentUser && listing.userRef !== currentUser._id && (
          <div className="mt-8">
            {!contact ? (
              <button onClick={() => setContact(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                Contact Owner
              </button>
            ) : (
              <Suspense fallback={<div>Loading...</div>}>
                <Contact listing={listing} onClose={() => setContact(false)} />
              </Suspense>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Listing;
