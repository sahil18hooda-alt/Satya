"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import './PillNav.css';

interface NavItem {
    label: string;
    href: string;
    id?: string;
    ariaLabel?: string;
    onClick?: () => void;
}

interface PillNavProps {
    logo: string;
    logoAlt?: string;
    items: NavItem[];
    activeHref: string;
    className?: string;
    ease?: string;
    baseColor?: string;
    pillColor?: string;
    hoveredPillTextColor?: string;
    pillTextColor?: string;
    onMobileMenuClick?: () => void;
    initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
    logo,
    logoAlt = 'Logo',
    items,
    activeHref,
    className = '',
    ease = 'power3.easeOut',
    baseColor = '#13316c',
    pillColor = '#fff',
    hoveredPillTextColor = '#fff',
    pillTextColor,
    onMobileMenuClick,
    initialLoadAnimation = true
}) => {
    const resolvedPillTextColor = pillTextColor ?? baseColor;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
    const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);
    const logoImgRef = useRef<HTMLImageElement>(null);
    const logoTweenRef = useRef<gsap.core.Tween | null>(null);
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const navItemsRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<any>(null);

    useEffect(() => {
        const layout = () => {
            circleRefs.current.forEach((circle, index) => {
                if (!circle?.parentElement) return;

                const pill = circle.parentElement;
                const rect = pill.getBoundingClientRect();
                const { width: w, height: h } = rect;

                // For rectangular version, we don't need complex circle math
                // But to keep the structure, we'll just use a large enough square
                const size = Math.max(w, h) * 1.5;

                circle.style.width = `${size}px`;
                circle.style.height = `${size}px`;
                circle.style.bottom = `-${size / 4}px`;

                gsap.set(circle, {
                    xPercent: -50,
                    scale: 0,
                    transformOrigin: `50% 100%`
                });

                const label = pill.querySelector('.pill-label');
                const white = pill.querySelector('.pill-label-hover');

                if (label) gsap.set(label, { y: 0 });
                if (white) gsap.set(white, { y: h + 12, opacity: 0 });

                tlRefs.current[index]?.kill();
                const tl = gsap.timeline({ paused: true });

                tl.to(circle, { scale: 1.5, xPercent: -50, duration: 1.2, ease, overwrite: 'auto' }, 0);

                if (label) {
                    tl.to(label, { y: -(h + 8), duration: 1.2, ease, overwrite: 'auto' }, 0);
                }

                if (white) {
                    gsap.set(white, { y: Math.ceil(h + 50), opacity: 0 });
                    tl.to(white, { y: 0, opacity: 1, duration: 1.2, ease, overwrite: 'auto' }, 0);
                }

                tlRefs.current[index] = tl;
            });
        };

        layout();

        const onResize = () => layout();
        window.addEventListener('resize', onResize);

        if (initialLoadAnimation) {
            const logoEl = logoRef.current;
            const navItemsEl = navItemsRef.current;

            if (logoEl) {
                gsap.set(logoEl, { scale: 0 });
                gsap.to(logoEl, {
                    scale: 1,
                    duration: 0.6,
                    ease
                });
            }

            if (navItemsEl) {
                gsap.set(navItemsEl, { width: 0, overflow: 'hidden' });
                gsap.to(navItemsEl, {
                    width: 'auto',
                    duration: 0.6,
                    ease
                });
            }
        }

        return () => window.removeEventListener('resize', onResize);
    }, [items, ease, initialLoadAnimation]);

    const handleEnter = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
            duration: 0.3,
            ease,
            overwrite: 'auto'
        });
    };

    const handleLeave = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(0, {
            duration: 0.2,
            ease,
            overwrite: 'auto'
        });
    };

    const handleLogoEnter = () => {
        const img = logoImgRef.current;
        if (!img) return;
        logoTweenRef.current?.kill();
        gsap.set(img, { rotate: 0 });
        logoTweenRef.current = gsap.to(img, {
            rotate: 360,
            duration: 0.4,
            ease,
            overwrite: 'auto'
        });
    };

    const toggleMobileMenu = () => {
        const newState = !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);

        const hamburger = hamburgerRef.current;
        const menu = mobileMenuRef.current;

        if (hamburger) {
            const lines = hamburger.querySelectorAll('.hamburger-line');
            if (newState) {
                gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
            } else {
                gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
            }
        }

        if (menu) {
            if (newState) {
                gsap.set(menu, { visibility: 'visible' });
                gsap.fromTo(
                    menu,
                    { opacity: 0, y: 10, scaleY: 1 },
                    {
                        opacity: 1,
                        y: 0,
                        scaleY: 1,
                        duration: 0.3,
                        ease,
                        transformOrigin: 'top center'
                    }
                );
            } else {
                gsap.to(menu, {
                    opacity: 0,
                    y: 10,
                    scaleY: 1,
                    duration: 0.2,
                    ease,
                    transformOrigin: 'top center',
                    onComplete: () => {
                        gsap.set(menu, { visibility: 'hidden' });
                    }
                });
            }
        }

        onMobileMenuClick?.();
    };

    const isExternalLink = (href: string) =>
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#');

    const cssVars = {
        ['--base' as any]: baseColor,
        ['--pill-bg' as any]: pillColor,
        ['--hover-text' as any]: hoveredPillTextColor,
        ['--pill-text' as any]: resolvedPillTextColor
    };

    return (
        <div className="pill-nav-container">
            <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
                <div
                    className="pill-logo"
                    onMouseEnter={handleLogoEnter}
                    ref={logoRef}
                >
                    <img src={logo} alt={logoAlt} ref={logoImgRef} />
                </div>

                <div className="pill-nav-items desktop-only" ref={navItemsRef}>
                    <ul className="pill-list" role="menubar">
                        {items.map((item, i) => (
                            <li key={item.id || item.href || `item-${i}`} role="none">
                                {isExternalLink(item.href) ? (
                                    <a
                                        role="menuitem"
                                        href={item.href}
                                        className={`pill${activeHref === (item.id || item.href) ? ' is-active' : ''}`}
                                        aria-label={item.ariaLabel || item.label}
                                        onMouseEnter={() => handleEnter(i)}
                                        onMouseLeave={() => handleLeave(i)}
                                        onClick={(e) => {
                                            if (item.onClick) {
                                                e.preventDefault();
                                                item.onClick();
                                            }
                                        }}
                                    >
                                        <span
                                            className="hover-circle"
                                            aria-hidden="true"
                                            ref={el => {
                                                circleRefs.current[i] = el;
                                            }}
                                        />
                                        <span className="label-stack">
                                            <span className="pill-label">{item.label}</span>
                                            <span className="pill-label-hover" aria-hidden="true">
                                                {item.label}
                                            </span>
                                        </span>
                                    </a>
                                ) : (
                                    <button
                                        role="menuitem"
                                        className={`pill${activeHref === (item.id || item.href) ? ' is-active' : ''}`}
                                        aria-label={item.ariaLabel || item.label}
                                        onMouseEnter={() => handleEnter(i)}
                                        onMouseLeave={() => handleLeave(i)}
                                        onClick={() => {
                                            if (item.onClick) item.onClick();
                                        }}
                                    >
                                        <span
                                            className="hover-circle"
                                            aria-hidden="true"
                                            ref={el => {
                                                circleRefs.current[i] = el;
                                            }}
                                        />
                                        <span className="label-stack">
                                            <span className="pill-label">{item.label}</span>
                                            <span className="pill-label-hover" aria-hidden="true">
                                                {item.label}
                                            </span>
                                        </span>
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    className="mobile-menu-button mobile-only"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                    ref={hamburgerRef}
                >
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                </button>
            </nav>

            <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={cssVars}>
                <ul className="mobile-menu-list">
                    {items.map((item, i) => (
                        <li key={`mobile-${item.id || item.href || i}`}>
                            <button
                                className={`mobile-menu-link${activeHref === (item.id || item.href) ? ' is-active' : ''}`}
                                onClick={() => {
                                    if (item.onClick) item.onClick();
                                    setIsMobileMenuOpen(false);
                                    toggleMobileMenu();
                                }}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PillNav;
