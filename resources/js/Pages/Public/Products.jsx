import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import {
    Sparkles,
    Search,
    SlidersHorizontal,
    X,
    Check,
    ArrowRight,
    Truck,
    Eye,
    ShoppingCart,
    ShoppingBag,
    Plus,
    Minus,
    Trash2,
    Heart,
    Grid,
    List,
    ChevronLeft,
    ChevronRight,
    Share2,
    CheckCircle2,
    Filter,
} from 'lucide-react';

/* -------------------------------------------------- */
/* Dynamic Floating Toast Notification                */
/* -------------------------------------------------- */
function NotificationToast({ toast, onDismiss, onOpenCart }) {
    if (!toast) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[130] flex items-center gap-3 rounded-2xl bg-charcoal/95 border border-bronze/40 p-3.5 shadow-2xl backdrop-blur-md text-white animate-fade-in max-w-sm">
            {toast.image ? (
                <img
                    src={toast.image}
                    alt={toast.title}
                    className="h-11 w-11 rounded-xl object-cover border border-white/10 shrink-0"
                />
            ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bronze/20 text-bronze shrink-0">
                    <Sparkles size={18} />
                </div>
            )}
            <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-semibold text-cream line-clamp-1">{toast.title}</p>
                <p className="text-[11px] text-cream/70 mt-0.5">{toast.message}</p>
            </div>
            {toast.action === 'cart' && (
                <button
                    onClick={onOpenCart}
                    className="shrink-0 rounded-lg bg-bronze px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-bronze-dark transition shadow-md"
                >
                    View Bag
                </button>
            )}
            <button
                onClick={onDismiss}
                className="text-cream/50 hover:text-cream p-1 transition"
                aria-label="Dismiss"
            >
                <X size={14} />
            </button>
        </div>
    );
}

/* -------------------------------------------------- */
/* Cart Slide-Over Drawer                             */
/* -------------------------------------------------- */
function CartDrawer({ isOpen, onClose, cart = [], updateQuantity, removeFromCart, clearCart }) {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const checkoutSubject = encodeURIComponent(
        `Order Inquiry (${totalItems} items, Total: BDT ${subtotal.toLocaleString('en-US')})`
    );
    const checkoutMessage = encodeURIComponent(
        `Hello ${settings.site_title || settings.company_name || 'Archi Texture'} Team,\n\nI would like to order the following curated pieces:\n` +
            cart
                .map(
                    (item, idx) =>
                        `${idx + 1}. ${item.name} (${item.category || 'Product'}) - Qty: ${item.quantity} - BDT ${(Number(item.price) * item.quantity).toLocaleString('en-US')}`
                )
                .join('\n') +
            `\n\nTotal: BDT ${subtotal.toLocaleString('en-US')}\n\nPlease contact me regarding order confirmation, delivery schedule, and invoice.`
    );

    return (
        <div className="fixed inset-0 z-[120] flex justify-end bg-charcoal/70 backdrop-blur-sm animate-fade-in">
            {/* Backdrop click dismiss */}
            <div className="fixed inset-0" onClick={onClose} />

            <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-sand px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <ShoppingBag size={20} className="text-bronze" />
                        <h2 className="font-serif-display text-xl text-charcoal">Your Selection</h2>
                        <span className="rounded-full bg-bronze/10 px-2.5 py-0.5 text-xs font-semibold text-bronze">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-charcoal/60 hover:bg-sand/40 hover:text-charcoal transition"
                        aria-label="Close cart"
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {cart.length > 0 ? (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="group flex items-start gap-4 rounded-xl border border-sand/70 p-3.5 bg-cream/20 hover:border-bronze/30 transition"
                            >
                                {/* Thumbnail */}
                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-sand/30 border border-sand/50">
                                    {item.featured_image ? (
                                        <img
                                            src={item.featured_image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-charcoal/30">
                                            Piece
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-serif-display text-sm font-semibold text-charcoal line-clamp-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-[11px] uppercase tracking-wider text-bronze font-medium mt-0.5">
                                                {item.category}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-charcoal/40 hover:text-red-600 transition p-1"
                                            title="Remove item"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        {/* Stepper */}
                                        <div className="inline-flex items-center rounded-lg border border-sand bg-white shadow-sm">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1.5 text-charcoal/60 hover:text-charcoal hover:bg-sand/30 transition rounded-l-lg"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={13} />
                                            </button>
                                            <span className="w-8 text-center text-xs font-semibold text-charcoal">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1.5 text-charcoal/60 hover:text-charcoal hover:bg-sand/30 transition rounded-r-lg"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={13} />
                                            </button>
                                        </div>

                                        {/* Item Total */}
                                        <span className="font-serif-display text-sm font-semibold text-bronze">
                                            BDT {((Number(item.price) || 0) * item.quantity).toLocaleString('en-US')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-sand/50 text-charcoal/40">
                                <ShoppingBag size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-serif-display text-lg text-charcoal">Your bag is empty</h3>
                            <p className="mt-1 max-w-[220px] text-xs text-charcoal/60">
                                Discover our architectural pieces and add them to your selection.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-bronze px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-bronze-dark transition"
                            >
                                Browse Pieces
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer & Checkout */}
                {cart.length > 0 && (
                    <div className="border-t border-sand bg-cream/30 p-6 space-y-4">
                        <div className="space-y-2 text-xs text-charcoal/70">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-serif-display font-semibold text-charcoal text-sm">
                                    BDT {subtotal.toLocaleString('en-US')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-charcoal/60">
                                <span className="flex items-center gap-1.5">
                                    <Truck size={13} className="text-bronze" /> White-Glove Delivery
                                </span>
                                <span className="text-emerald-700 font-semibold uppercase tracking-wider text-[10px]">
                                    Complimentary
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-sand/70 pt-3 flex justify-between items-baseline">
                            <span className="font-serif-display text-base font-semibold text-charcoal">
                                Total Estimated
                            </span>
                            <span className="font-serif-display text-xl font-bold text-bronze">
                                BDT {subtotal.toLocaleString('en-US')}
                            </span>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Link
                                href={`/contact?subject=${checkoutSubject}&message=${checkoutMessage}`}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-[8px] bg-bronze py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-xl hover:bg-bronze-dark transition-all duration-300"
                            >
                                Proceed to Order Inquiry <ArrowRight size={14} />
                            </Link>

                            <div className="flex items-center justify-between pt-1">
                                <button
                                    onClick={clearCart}
                                    className="text-[11px] text-charcoal/50 hover:text-red-600 transition uppercase tracking-wider"
                                >
                                    Clear Bag
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-[11px] text-charcoal/60 hover:text-charcoal transition uppercase tracking-wider"
                                >
                                    Continue Browsing
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* -------------------------------------------------- */
/* Smart Interactive Product Card                     */
/* -------------------------------------------------- */
function SmartProductCard({
    product,
    cartItem,
    addToCart,
    updateQuantity,
    onQuickView,
    isWishlisted,
    toggleWishlist,
    viewMode = 'grid',
}) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    // Available images for quick hover carousel
    const cardImages = useMemo(() => {
        const list = [];
        if (product.featured_image) list.push(product.featured_image);
        if (Array.isArray(product.gallery)) {
            product.gallery.forEach((g) => {
                if (g && !list.includes(g)) list.push(g);
            });
        }
        return list;
    }, [product]);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        setIsAdding(true);
        addToCart(product);
        setTimeout(() => setIsAdding(false), 1200);
    };

    const handlePrevImg = (e) => {
        e.stopPropagation();
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : cardImages.length - 1));
    };

    const handleNextImg = (e) => {
        e.stopPropagation();
        setActiveIdx((prev) => (prev < cardImages.length - 1 ? prev + 1 : 0));
    };

    const currentImg = cardImages[activeIdx] || product.featured_image;

    if (viewMode === 'list') {
        return (
            <div className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-white border border-sand/80 shadow-sm hover:shadow-xl hover:border-bronze/40 transition-all duration-300">
                {/* Image Section */}
                <div className="relative aspect-[4/3] sm:aspect-square sm:w-64 shrink-0 overflow-hidden bg-sand/30">
                    {currentImg ? (
                        <img
                            src={currentImg}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-charcoal/30">
                            No image
                        </div>
                    )}

                    {/* Wishlist */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                        }}
                        className={`absolute right-3 top-3 z-10 rounded-full p-2 backdrop-blur-md shadow-sm transition-all duration-200 ${
                            isWishlisted
                                ? 'bg-rose-50 text-rose-500 shadow-md scale-110'
                                : 'bg-white/85 text-charcoal/60 hover:bg-white hover:text-rose-500'
                        }`}
                        title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                        aria-label="Wishlist"
                    >
                        <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>

                    {/* Category */}
                    {product.category && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal shadow-sm">
                            {product.category}
                        </span>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                In Stock • White-Glove Handled
                            </span>
                            {product.sku && (
                                <span className="text-[10px] font-mono text-charcoal/40">{product.sku}</span>
                            )}
                        </div>

                        <h3
                            onClick={() => onQuickView(product)}
                            className="mt-1.5 font-serif-display text-xl font-semibold text-charcoal hover:text-bronze cursor-pointer transition-colors"
                        >
                            {product.name}
                        </h3>

                        {product.summary && (
                            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-charcoal/70 line-clamp-2">
                                {product.summary}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-sand/70 pt-4">
                        <div>
                            <span className="text-[10px] uppercase tracking-wider text-charcoal/50 block">Direct Price</span>
                            {product.price ? (
                                <span className="font-serif-display text-xl font-bold text-bronze">
                                    BDT {Number(product.price).toLocaleString('en-US')}
                                </span>
                            ) : (
                                <span className="text-xs text-charcoal/50 italic">Price on request</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => onQuickView(product)}
                                className="inline-flex items-center gap-1.5 rounded-[8px] border border-sand bg-cream/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-charcoal hover:border-bronze hover:bg-sand/60 transition"
                            >
                                <Eye size={13} />
                                <span>Inspect</span>
                            </button>

                            {cartItem ? (
                                <div className="flex items-center gap-1.5 rounded-[8px] bg-sand/30 border border-bronze/40 p-1">
                                    <button
                                        onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                                        className="h-7 w-7 flex items-center justify-center rounded bg-white text-charcoal shadow-sm hover:bg-sand transition"
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="w-7 text-center text-xs font-bold text-charcoal">
                                        {cartItem.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                                        className="h-7 w-7 flex items-center justify-center rounded bg-white text-charcoal shadow-sm hover:bg-sand transition"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                    className={`inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-300 ${
                                        isAdding ? 'bg-emerald-600' : 'bg-charcoal hover:bg-bronze'
                                    }`}
                                >
                                    {isAdding ? <Check size={13} /> : <ShoppingCart size={13} />}
                                    <span>{isAdding ? 'Added' : 'Add to Bag'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-sand/80 shadow-sm hover:shadow-2xl hover:border-bronze/40 transition-all duration-300"
            onMouseEnter={() => cardImages.length > 1 && setActiveIdx(1)}
            onMouseLeave={() => setActiveIdx(0)}
        >
            {/* Top Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/30">
                {currentImg ? (
                    <img
                        src={currentImg}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-charcoal/30">
                        No image
                    </div>
                )}

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Badges: Category & Stock Status */}
                <div className="absolute left-3.5 top-3.5 flex flex-col gap-1.5 items-start z-10">
                    {product.category && (
                        <span className="rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal shadow-sm">
                            {product.category}
                        </span>
                    )}
                    {product.is_featured && (
                        <span className="rounded-full bg-bronze/90 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">
                            Featured Piece
                        </span>
                    )}
                </div>

                {/* Top-Right Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                    }}
                    className={`absolute right-3.5 top-3.5 z-10 rounded-full p-2 backdrop-blur-md shadow-sm transition-all duration-200 ${
                        isWishlisted
                            ? 'bg-rose-50 text-rose-500 shadow-md scale-110'
                            : 'bg-white/85 text-charcoal/60 hover:bg-white hover:text-rose-500'
                    }`}
                    title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                    aria-label="Wishlist"
                >
                    <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Image Nav Arrows (if multi-gallery) */}
                {cardImages.length > 1 && (
                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-auto">
                        <button
                            onClick={handlePrevImg}
                            className="h-7 w-7 rounded-full bg-white/90 text-charcoal shadow-md flex items-center justify-center hover:bg-white transition"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <button
                            onClick={handleNextImg}
                            className="h-7 w-7 rounded-full bg-white/90 text-charcoal shadow-md flex items-center justify-center hover:bg-white transition"
                            aria-label="Next image"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}

                {/* Image Dots Indicator (if gallery has multiple) */}
                {cardImages.length > 1 && (
                    <div className="absolute bottom-3 left-3.5 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {cardImages.slice(0, 4).map((_, i) => (
                            <span
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-200 ${
                                    activeIdx === i ? 'w-4 bg-white shadow' : 'w-1.5 bg-white/60'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Quick View Button */}
                <button
                    onClick={() => onQuickView(product)}
                    className="absolute bottom-3 right-3.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-charcoal shadow-md opacity-100 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 hover:bg-bronze hover:text-white"
                >
                    <Eye size={13} />
                    <span>Quick View</span>
                </button>
            </div>

            {/* Info Container */}
            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                    {/* Title and Stock Indicator */}
                    <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            In Stock
                        </span>
                        {product.sku && (
                            <span className="text-[10px] font-mono text-charcoal/40">{product.sku}</span>
                        )}
                    </div>

                    <h3
                        onClick={() => onQuickView(product)}
                        className="mt-1 font-serif-display text-lg font-semibold text-charcoal hover:text-bronze cursor-pointer transition-colors line-clamp-1"
                    >
                        {product.name}
                    </h3>

                    {product.summary && (
                        <p className="mt-1.5 text-xs leading-relaxed text-charcoal/60 line-clamp-2">
                            {product.summary}
                        </p>
                    )}
                </div>

                {/* Bottom Action Area: Price + Smart Add to Cart */}
                <div className="mt-5 pt-4 border-t border-sand/70">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] uppercase tracking-wider text-charcoal/50">Price</span>
                        {product.price ? (
                            <span className="font-serif-display text-base sm:text-lg font-bold text-bronze">
                                BDT {Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                            </span>
                        ) : (
                            <span className="text-xs text-charcoal/50 italic">Price on request</span>
                        )}
                    </div>

                    {/* Interactive Cart Button / Stepper */}
                    {cartItem ? (
                        <div className="flex items-center justify-between gap-2 rounded-xl bg-sand/30 border border-bronze/40 p-1.5 shadow-sm">
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-charcoal shadow-sm hover:bg-sand transition"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={13} />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-charcoal">
                                    {cartItem.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-charcoal shadow-sm hover:bg-sand transition"
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={13} />
                                </button>
                            </div>

                            <span className="pr-2 text-[11px] font-semibold uppercase tracking-wider text-bronze">
                                In Bag ✓
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`w-full inline-flex items-center justify-center gap-2 rounded-[8px] py-2.5 px-4 text-xs font-semibold uppercase tracking-[0.14em] shadow-sm transition-all duration-300 ${
                                isAdding
                                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                                    : 'bg-charcoal text-white hover:bg-bronze hover:shadow-lg hover:shadow-bronze/20'
                            }`}
                        >
                            {isAdding ? (
                                <>
                                    <Check size={14} className="animate-bounce" />
                                    <span>Added to Bag!</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart size={14} />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------- */
/* Quick View Modal                                   */
/* -------------------------------------------------- */
function ProductModal({ product, onClose, cartItem, addToCart, updateQuantity, isWishlisted, toggleWishlist }) {
    if (!product) return null;

    const [activeImg, setActiveImg] = useState(
        product.featured_image || (Array.isArray(product.gallery) && product.gallery[0]) || ''
    );
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const images = useMemo(() => {
        const list = [];
        if (product.featured_image) list.push(product.featured_image);
        if (Array.isArray(product.gallery)) {
            product.gallery.forEach((img) => {
                if (img && !list.includes(img)) list.push(img);
            });
        }
        return list;
    }, [product]);

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(product);
        setTimeout(() => setIsAdding(false), 1200);
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-charcoal/80 backdrop-blur-sm animate-fade-in"
        >
            <div
                className="relative w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col md:flex-row border border-sand"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 z-40 rounded-full bg-charcoal/80 hover:bg-charcoal text-white p-2 shadow-lg backdrop-blur-sm transition duration-200"
                    aria-label="Close modal"
                >
                    <X size={18} />
                </button>

                {/* Left: Images */}
                <div className="w-full md:w-1/2 bg-sand/20 p-4 sm:p-6 flex flex-col justify-between shrink-0">
                    <div className="relative aspect-[16/10] sm:aspect-square w-full overflow-hidden rounded-xl bg-sand/40 shadow-inner">
                        {activeImg ? (
                            <img
                                src={activeImg}
                                alt={product.name || 'Product'}
                                className="h-full w-full object-cover transition-all duration-300"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-charcoal/40 text-xs">
                                No image available
                            </div>
                        )}
                        {product.is_featured && (
                            <span className="absolute left-3 top-3 rounded-full bg-bronze px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow">
                                Featured Piece
                            </span>
                        )}
                    </div>

                    {/* Thumbnail gallery */}
                    {images.length > 1 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImg(img)}
                                    className={`relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                                        activeImg === img
                                            ? 'border-bronze shadow-md'
                                            : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 p-5 sm:p-7 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between gap-2 mb-2 pr-8">
                            <div className="flex items-center gap-2">
                                {product.category && (
                                    <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.15em] text-bronze">
                                        {product.category}
                                    </span>
                                )}
                                {product.sku && (
                                    <span className="text-[10px] sm:text-[11px] text-charcoal/40 font-mono">
                                        • {product.sku}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => toggleWishlist(product.id)}
                                className={`p-1.5 rounded-full transition ${
                                    isWishlisted ? 'text-rose-500 bg-rose-50' : 'text-charcoal/40 hover:text-rose-500'
                                }`}
                                title="Wishlist"
                            >
                                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        <h2 className="font-serif-display text-xl sm:text-2xl md:text-3xl text-charcoal leading-snug pr-6">
                            {product.name}
                        </h2>

                        {product.price ? (
                            <div className="mt-2.5 flex items-baseline gap-2.5">
                                <span className="font-serif-display text-xl sm:text-2xl text-bronze font-bold">
                                    BDT {Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                </span>
                                <span className="text-[10px] sm:text-xs text-charcoal/50 uppercase tracking-wider">
                                    In Stock
                                </span>
                            </div>
                        ) : (
                            <span className="text-xs text-charcoal/50 italic mt-2 block">Price on request</span>
                        )}

                        {product.summary && (
                            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-charcoal/70 border-l-2 border-bronze/40 pl-3 italic">
                                {product.summary}
                            </p>
                        )}

                        {product.description && (
                            <div className="mt-3 text-xs sm:text-sm leading-relaxed text-charcoal/80">
                                <p>{product.description}</p>
                            </div>
                        )}

                        <div className="mt-4 border-t border-sand pt-3 space-y-1.5 text-[11px] sm:text-xs text-charcoal/70">
                            <div className="flex items-center gap-2">
                                <Check size={13} className="text-bronze shrink-0" />
                                <span>Complimentary white-glove delivery & placement</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check size={13} className="text-bronze shrink-0" />
                                <span>Authenticity certificate & lifetime warranty</span>
                            </div>
                        </div>
                    </div>

                    {/* Modal Cart Controls & Actions */}
                    <div className="mt-6 pt-4 border-t border-sand flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            {cartItem ? (
                                <div className="flex items-center gap-2 rounded-full border border-bronze/40 bg-sand/30 px-3 py-1.5">
                                    <button
                                        onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                                        className="p-1 text-charcoal/60 hover:text-charcoal transition"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus size={13} />
                                    </button>
                                    <span className="w-6 text-center text-xs font-bold text-charcoal">
                                        {cartItem.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                                        className="p-1 text-charcoal/60 hover:text-charcoal transition"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>
                            ) : null}

                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-[8px] py-3 px-6 text-xs font-semibold uppercase tracking-[0.14em] shadow-lg transition-all duration-300 ${
                                    isAdding
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-bronze text-white hover:bg-bronze-dark'
                                }`}
                            >
                                {isAdding ? (
                                    <>
                                        <Check size={14} className="animate-bounce" />
                                        <span>Added to Bag!</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={14} />
                                        <span>{cartItem ? 'Add More' : 'Add to Cart'}</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <Link
                                href={`/contact?subject=${encodeURIComponent(`Product Inquiry: ${product.name} (BDT ${Number(product.price).toLocaleString('en-US')})`)}`}
                                className="text-charcoal/60 hover:text-bronze underline transition text-[11px]"
                            >
                                Inquire Directly
                            </Link>
                            <button
                                onClick={onClose}
                                className="text-charcoal/60 hover:text-charcoal uppercase tracking-wider text-[11px]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------- */
/* Main Products Page Component                       */
/* -------------------------------------------------- */
export default function Products({ products = [], settings = {} }) {
    const [selectedCategory, setSelectedCategory] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('category') || 'All';
        }
        return 'All';
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [onlyWishlist, setOnlyWishlist] = useState(false);
    const [activeModalProduct, setActiveModalProduct] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('category');
        if (cat) {
            setSelectedCategory(cat);
        }
    }, []);

    // Cart State (Persisted in localStorage)
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('archi_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Wishlist State
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('archi_wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('archi_cart', JSON.stringify(cart));
        } catch (e) {
            console.error(e);
        }
    }, [cart]);

    useEffect(() => {
        try {
            localStorage.setItem('archi_wishlist', JSON.stringify(wishlist));
        } catch (e) {
            console.error(e);
        }
    }, [wishlist]);

    const showToast = (title, message, image = null, action = null) => {
        setToast({ title, message, image, action });
        setTimeout(() => {
            setToast((prev) => (prev?.title === title ? null : prev));
        }, 4000);
    };

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                showToast(
                    product.name,
                    `Quantity updated in bag (${existing.quantity + 1})`,
                    product.featured_image,
                    'cart'
                );
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            showToast(product.name, 'Added to your bespoke selection', product.featured_image, 'cart');
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    featured_image: product.featured_image,
                    sku: product.sku,
                    quantity: 1,
                },
            ];
        });
    };

    const updateQuantity = (productId, newQty) => {
        if (newQty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
        );
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const toggleWishlist = (productId) => {
        const product = products.find((p) => p.id === productId);
        setWishlist((prev) => {
            const isSaved = prev.includes(productId);
            if (isSaved) {
                showToast(product?.name || 'Wishlist', 'Removed from saved pieces');
                return prev.filter((id) => id !== productId);
            } else {
                showToast(
                    product?.name || 'Wishlist',
                    'Saved to your curated wishlist',
                    product?.featured_image
                );
                return [...prev, productId];
            }
        });
    };

    const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Derive unique categories
    const categories = useMemo(() => {
        const set = new Set();
        products.forEach((p) => {
            if (p.category) set.add(p.category);
        });
        return ['All', ...Array.from(set)];
    }, [products]);

    // Filter and Sort
    const filteredProducts = useMemo(() => {
        return products
            .filter((item) => {
                const matchesCat =
                    selectedCategory === 'All' ||
                    item.category?.toLowerCase() === selectedCategory.toLowerCase();
                const matchesSearch =
                    !searchQuery ||
                    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.category?.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesWishlist = !onlyWishlist || wishlist.includes(item.id);
                return matchesCat && matchesSearch && matchesWishlist;
            })
            .sort((a, b) => {
                if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
                if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
                if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
                return (a.sort_order || 0) - (b.sort_order || 0);
            });
    }, [products, selectedCategory, searchQuery, sortBy, onlyWishlist, wishlist]);

    const hasActiveFilters = selectedCategory !== 'All' || searchQuery !== '' || onlyWishlist;

    return (
        <PublicLayout settings={settings}>
            <Head title={`Our Products — ${settings.site_title || settings.company_name || 'Archi Texture'}`} />

            {/* Dynamic Interactive Hero (Compact & Sleek) */}
            <section
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                }}
                className="relative overflow-hidden bg-gradient-to-b from-[#181715] via-[#211F1C] to-[#161514] py-6 sm:py-8 text-white transition-all duration-300 border-b border-sand/10"
            >
                {/* Interactive Ambient Radial Glow */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-500"
                    style={{
                        background:
                            'radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(169, 137, 82, 0.25), transparent 70%)',
                    }}
                />

                {/* Subtle Background Architectural Monogram */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                    <span className="font-serif-display select-none text-[10vw] italic font-bold tracking-tight text-white/[0.02] whitespace-nowrap">
                        {settings.site_title || settings.company_name || 'ARCHI TEXTURE'}
                    </span>
                </div>

                {/* Subtle Architectural Grid Lines */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-10">
                    <div className="flex flex-col items-center text-center">
                        {/* Exclusive Products Title */}
                        <div className="relative group">
                            <h1 className="font-serif-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] leading-[1.12] sm:leading-[1.08] text-white">
                                Our Exclusive Products
                            </h1>

                        </div>

                        <p className="mt-2.5 text-xs sm:text-sm text-cream/70 max-w-xl">
                            Curated architectural lighting, tactile furniture, and noble spatial objects crafted with meticulous generational mastery.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter, Search, Wishlist & Controls Bar */}
            <section className="border-b border-sand bg-white py-3 sm:py-3.5 sticky top-[72px] z-40 backdrop-blur-md bg-white/95 shadow-sm">
                <div className="mx-auto max-w-[1440px] px-4 md:px-10">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        {/* Category Pills (Horizontal scrolling on mobile) */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 sm:flex-wrap shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {categories.map((cat) => {
                                const isSelected = selectedCategory === cat && !onlyWishlist;
                                const count =
                                    cat === 'All'
                                        ? products.length
                                        : products.filter((p) => p.category === cat).length;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setOnlyWishlist(false);
                                        }}
                                        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 shrink-0 ${
                                            isSelected
                                                ? 'bg-charcoal text-white shadow-sm'
                                                : 'bg-sand/40 text-charcoal/70 hover:bg-sand hover:text-charcoal'
                                        }`}
                                    >
                                        <span>{cat}</span>
                                        <span
                                            className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                                                isSelected
                                                    ? 'bg-bronze text-white'
                                                    : 'bg-charcoal/10 text-charcoal/60'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}

                            {/* Wishlist quick-filter pill */}
                            {wishlist.length > 0 && (
                                <button
                                    onClick={() => setOnlyWishlist(!onlyWishlist)}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 shrink-0 ${
                                        onlyWishlist
                                            ? 'bg-rose-600 text-white shadow-sm'
                                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                                    }`}
                                >
                                    <Heart size={12} fill={onlyWishlist ? 'currentColor' : 'none'} />
                                    <span>Saved ({wishlist.length})</span>
                                </button>
                            )}
                        </div>

                        {/* Search, Sort, Layout & Cart Drawer Trigger */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                            {/* Search */}
                            <div className="relative flex-1 sm:w-48 md:w-56">
                                <Search
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
                                />
                                <input
                                    type="text"
                                    placeholder="Search pieces..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-full border border-sand bg-cream/40 pl-8 pr-7 py-1.5 text-xs text-charcoal placeholder-charcoal/40 focus:border-bronze focus:bg-white focus:outline-none focus:ring-1 focus:ring-bronze transition"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-1.5">
                                <SlidersHorizontal size={13} className="text-charcoal/50" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="rounded-full border border-sand bg-cream/40 px-2.5 py-1.5 text-xs font-medium text-charcoal/80 focus:border-bronze focus:bg-white focus:outline-none focus:ring-1 focus:ring-bronze transition cursor-pointer"
                                >
                                    <option value="default">Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="name">Alphabetical</option>
                                </select>
                            </div>

                            {/* View Toggle (Grid / List) */}
                            <div className="hidden sm:inline-flex items-center rounded-full border border-sand bg-cream/40 p-0.5">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-full transition ${
                                        viewMode === 'grid'
                                            ? 'bg-charcoal text-white shadow-sm'
                                            : 'text-charcoal/50 hover:text-charcoal'
                                    }`}
                                    title="Grid View"
                                    aria-label="Grid View"
                                >
                                    <Grid size={13} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-full transition ${
                                        viewMode === 'list'
                                            ? 'bg-charcoal text-white shadow-sm'
                                            : 'text-charcoal/50 hover:text-charcoal'
                                    }`}
                                    title="List View"
                                    aria-label="List View"
                                >
                                    <List size={13} />
                                </button>
                            </div>

                            {/* Cart Button */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="inline-flex items-center gap-2 rounded-full bg-bronze/10 border border-bronze/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-bronze hover:bg-bronze hover:text-white transition-all duration-200 shadow-sm"
                            >
                                <ShoppingBag size={14} />
                                <span className="hidden sm:inline">Bag</span>
                                <span className="rounded-full bg-bronze px-1.5 py-0.2 text-[10px] text-white">
                                    {totalCartCount}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Active Filters Summary Bar */}
                    {hasActiveFilters && (
                        <div className="mt-2.5 pt-2.5 border-t border-sand/50 flex flex-wrap items-center justify-between gap-2 text-xs text-charcoal/70">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-semibold text-charcoal/50">Active:</span>
                                {selectedCategory !== 'All' && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-sand/60 px-2 py-0.5 text-[11px] font-medium text-charcoal">
                                        Category: {selectedCategory}
                                        <button onClick={() => setSelectedCategory('All')}>
                                            <X size={11} className="hover:text-red-600" />
                                        </button>
                                    </span>
                                )}
                                {searchQuery && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-sand/60 px-2 py-0.5 text-[11px] font-medium text-charcoal">
                                        Search: "{searchQuery}"
                                        <button onClick={() => setSearchQuery('')}>
                                            <X size={11} className="hover:text-red-600" />
                                        </button>
                                    </span>
                                )}
                                {onlyWishlist && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-800">
                                        Wishlist Only
                                        <button onClick={() => setOnlyWishlist(false)}>
                                            <X size={11} className="hover:text-red-600" />
                                        </button>
                                    </span>
                                )}
                                <button
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setSearchQuery('');
                                        setOnlyWishlist(false);
                                    }}
                                    className="text-[11px] font-semibold text-bronze hover:underline ml-1"
                                >
                                    Clear all
                                </button>
                            </div>

                            <span className="text-[11px] text-charcoal/50 font-medium">
                                Showing {filteredProducts.length} of {products.length} pieces
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* Smart Products Grid */}
            <section className="bg-cream/30 py-7 sm:py-9 min-h-[50vh]">
                <div className="mx-auto max-w-[1440px] px-4 md:px-10">
                    {filteredProducts.length > 0 ? (
                        <div
                            className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6'
                                    : 'flex flex-col gap-4'
                            }
                        >
                            {filteredProducts.map((product) => {
                                const cartItem = cart.find((item) => item.id === product.id);
                                const isWish = wishlist.includes(product.id);
                                return (
                                    <SmartProductCard
                                        key={product.id}
                                        product={product}
                                        cartItem={cartItem}
                                        addToCart={addToCart}
                                        updateQuantity={updateQuantity}
                                        onQuickView={(p) => setActiveModalProduct(p)}
                                        isWishlisted={isWish}
                                        toggleWishlist={toggleWishlist}
                                        viewMode={viewMode}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-sand bg-white py-16 px-4 text-center max-w-lg mx-auto shadow-sm">
                            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sand/50 text-charcoal/40">
                                <Search size={22} />
                            </div>
                            <p className="font-serif-display text-xl text-charcoal">No matching pieces found</p>
                            <p className="mt-2 text-xs sm:text-sm text-charcoal/60 leading-relaxed">
                                {onlyWishlist
                                    ? 'You have not saved any pieces to your wishlist yet.'
                                    : 'We could not find any products matching your active filters or keywords.'}
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedCategory('All');
                                    setSearchQuery('');
                                    setOnlyWishlist(false);
                                }}
                                className="mt-5 inline-flex items-center rounded-[8px] bg-bronze px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-bronze-dark transition shadow-md"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Floating Quick-Access Bag Button */}
            {totalCartCount > 0 && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-charcoal text-white px-5 py-3.5 shadow-2xl border border-bronze/50 hover:bg-bronze hover:scale-105 transition-all duration-300 animate-bounce"
                    style={{ animationIterationCount: 2 }}
                    aria-label="Open Cart"
                >
                    <div className="relative">
                        <ShoppingBag size={18} />
                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-bronze text-[10px] font-bold text-white shadow">
                            {totalCartCount}
                        </span>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider">
                        View Bag ({totalCartCount})
                    </span>
                </button>
            )}

            {/* Toast feedback alert */}
            <NotificationToast
                toast={toast}
                onDismiss={() => setToast(null)}
                onOpenCart={() => {
                    setToast(null);
                    setIsCartOpen(true);
                }}
            />

            {/* Quick View Modal Dialog */}
            {activeModalProduct && (
                <ProductModal
                    product={activeModalProduct}
                    onClose={() => setActiveModalProduct(null)}
                    cartItem={cart.find((item) => item.id === activeModalProduct.id)}
                    addToCart={addToCart}
                    updateQuantity={updateQuantity}
                    isWishlisted={wishlist.includes(activeModalProduct.id)}
                    toggleWishlist={toggleWishlist}
                />
            )}

            {/* Slide-over Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
            />
        </PublicLayout>
    );
}
