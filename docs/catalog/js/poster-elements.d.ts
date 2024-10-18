import { Equivalence as EQ, Predicate as PR, flow, pipe } from 'effect';
import { unzip, zip } from 'effect/Array';
import { FunctionN, LazyArg, apply, compose, constFalse, constNull, constTrue, constUndefined, constant as K, flip, identity as id, tupled, untupled } from 'effect/Function';
import * as NU from 'effect/Number';
import { omit } from 'effect/Struct';
import { getFirst, getSecond, mapFirst, mapSecond } from 'effect/Tuple';

declare const append: <P extends Node>(parent: P) => (child: Node) => P;
declare const prepend: <P extends Element>(parent: P) => (child: Node) => P;
declare const appendAll: <P extends Node>(parent: P) => (children: Iterable<Node>) => P;
declare const prependAll: <P extends Element>(parent: P) => (children: Iterable<Node>) => P;
declare const appendF: Unary<Node, EndoOf<Node>>, prependF: Unary<Node, EndoOf<Node>>;
declare const appendAllF: Unary<Iterable<Node>, EndoOf<Node>>, prependAllF: Unary<Iterable<Node>, EndoOf<Node>>;
declare const erase: <N extends Node>(parent: N) => [
	parent: N,
	erased: Node[]
];
declare const wrap: (...classes: string[]) => Endo<HTMLElement>;
declare const appendTextDiv: Unary<string, EndoOf<Node>>;
interface Builder<M, E> {
	(model: M): VoidConstructor<E>;
}
type CustomTag = `${string}-${string}`;
type Path = (number | string)[];
type Theme = "light" | "dark";
type MouseHandler = Unary<MouseEvent, void>;
type PointerHandler = Unary<PointerEvent, void>;
declare const element: (tag: string, ...classes: string[]) => HTMLElement;
declare const elementC: (tag: string) => (...classes: string[]) => HTMLElement;
interface FromClasses<E extends HTMLElement> {
	(...classes: string[]): E;
}
declare const div: FromClasses<HTMLDivElement>;
declare const h1: FromClasses<HTMLElement>, h2: FromClasses<HTMLElement>, h3: FromClasses<HTMLElement>, h4: FromClasses<HTMLElement>;
declare const text: Unary<string, EndoOf<HTMLElement>>;
declare const attr: <E extends Element, K extends string>(element: E, key: K, value: number | string) => E;
declare const attrC: <K extends string>(key: K, value: number | string) => EndoOf<Element>;
declare const attrs: <E extends Element, K extends string>(element: E, all: Record<K, number | string>) => E;
declare const attrsC: <K extends string>(all: Record<K, number | string>) => EndoOf<Element>;
declare const setTabIndex: Unary<number, EndoOf<Element>>;
declare const defineCustom: <const T extends CustomTag>(tag: T, ...classes: string[]) => <E extends HTMLElement>(construct: VoidConstructor<E>) => LazyArg<E>;
declare const textDiv: (s: string) => HTMLDivElement;
declare const builderFor: <P extends object>() => <const T extends CustomTag, E extends HTMLElement>(tag: T, element: VoidConstructor<E>) => ((props: P, ...classes: string[]) => E) & {
	readonly tag: T;
};
declare const mouseEnter: <O extends object>(instance: O, method: LazyArg<O>) => <E extends HTMLElement | SVGElement | Element>(element: E) => E;
declare const mouseLeave: <O extends object>(instance: O, method: LazyArg<O>) => <E extends HTMLElement | SVGElement | Element>(element: E) => E;
declare const pointerDown: <O extends object>(instance: O, method: Unary<PointerEvent, O>) => <E extends HTMLElement | SVGElement | Element>(element: E) => E;
declare const pointerUp: <O extends Node>(instance: O, method: LazyArg<O>, action: Unary<PointerEvent, O>) => <E extends HTMLElement | SVGElement | Element>(element: E) => E;
declare const keyDown: <O extends Node>(instance: O, method: Unary<KeyboardEvent, O>) => <E extends HTMLElement | SVGElement | Element>(element: E) => void;
declare const keyUp: <O extends Node>(instance: O, method: Unary<KeyboardEvent, O>) => <E extends HTMLElement | SVGElement | Element>(element: E) => void;
declare const measureElement: (element: HTMLElement) => number;
type V2 = [
	number,
	number
];
interface V4 {
	center: V2;
	size: V2;
}
type TopLeft = "top" | "left";
type XY = "x" | "y";
type WidthHeight = "width" | "height";
type LayoutKey = TopLeft | WidthHeight;
type SvgLayoutKey = XY | WidthHeight;
declare const build: Binary<number, number, V2>, buildC: (fst: number) => Unary<number, V2>;
declare const of: <K1 extends string, K2 extends string>(k1: K1, k2: K2) => <A>([fst, snd]: Pair<A>) => Record<K1 | K2, A>;
declare const square: (size: number) => V4;
declare const Equivalence: EQ.Equivalence<V2>;
declare const centerToTopLeft: Unary<V4, V2>;
declare const centerInside: BinOpC<V2>;
declare const show: Unary<V2, string>;
declare const zero: V2, zero4: V4, unit: V2, add: BinOp<V2>, addC: BinOpC<V2>, subtract: BinOp<V2>, isZero: PR.Predicate<V2>, toSize: Unary<V2, Record<WidthHeight, number>>, toPxSize: Unary<V2, Record<WidthHeight, string>>, toTopLeft: Unary<V2, Record<TopLeft, number>>, toPxTopLeft: Unary<V2, Record<TopLeft, string>>, toXY: Unary<V4, Record<XY, number>>, fromFirst: (n: number) => V2, fromSecond: (n: number) => V2, fromTop: (n: number) => V2, fromLeft: (n: number) => V2, fromWidth: (n: number) => V2, fromHeight: (n: number) => V2, pxBoth: Unary<V2, Pair<string>>, addFirst: Unary<number, Endo<V2>>, addSecond: Unary<number, Endo<V2>>, multiplyFirst: Unary<number, Endo<V2>>, multiplySecond: Unary<number, Endo<V2>>, multiply: Unary<number, Endo<V2>>, mirror: Endo<V2>, negateFirst: Endo<V2>, negateSecond: Endo<V2>, doubleFirst: Endo<V2>, doubleSecond: Endo<V2>, double: Endo<V2>, halfFirst: Endo<V2>, halfSecond: Endo<V2>, half: Endo<V2>, subtractC: BinOpC<V2>, subtractFirst: Unary<number, Endo<V2>>, subtractSecond: Unary<number, Endo<V2>>, circumference: Unary<V2, number>, absFirst: Unary<V2, number>, absSecond: Unary<V2, number>, distanceFromOrigin: Unary<V2, number>;
declare const modCenter: Unary<Endo<V2>, Endo<V4>>, modSize: Unary<Endo<V2>, Endo<V4>>;
declare const layout: Unary<V4, Record<LayoutKey, string>>;
declare const absoluteLayout: Unary<V4, Record<LayoutKey, string> & {
	position: "absolute";
}>;
declare const svgLayout: Unary<V4, Record<SvgLayoutKey, number>>;
declare const squarePxSize: (n: number) => {
	width: string;
	height: string;
};
declare const squareAbsolute: (n: number) => {
	top: string;
	left: string;
	position: string;
};
declare const joinPath: Unary<Path, string>;
declare const roundRect: {
	(radius: number, foci?: number, moveX?: number, moveY?: number): Path;
	size(radius: number, foci: number): VE.V2;
};
declare const circle: (radius: number, moveX?: number, moveY?: number) => Path;
declare const circleRing: (radius: number, radialWidth: number) => Path;
declare const roundRectRing: (radius: number, radialWidth: number, foci: number) => Path;
declare const tongue: {
	(radius: number, foci: number): Path;
	size(radius: number, foci: number): VE.V2;
};
declare const moon: (radius: number) => Path;
declare const style: <E extends HTMLElement | SVGElement>(element: E, key: string, value: number | string) => E;
declare const styleC: (key: string, value: number | string) => EndoOf<HTMLElement | SVGElement>;
declare const styles: <E extends Element>(node: E, all?: Record<string, string | number>) => E;
declare const stylesC: (all: Record<string, number | string>) => EndoOf<Element>;
declare const addClass: Unary<string, EndoOf<Element>>;
declare const addClasses: (...classes: string[]) => EndoOf<Element>;
declare const removeClass: Unary<string, EndoOf<Element>>;
declare const styleWidth: (n: number) => EndoOf<HTMLElement | SVGElement>, styleHeight: (n: number) => EndoOf<HTMLElement | SVGElement>;
declare const styleSize: ([w, h]: VE.V2) => EndoOf<HTMLElement | SVGElement>;
declare const styleSquareSize: (n: number) => EndoOf<HTMLElement | SVGElement>;
declare const absoluteSquareTopLeft: (n: number) => EndoOf<HTMLElement | SVGElement>;
declare const styleLeft: (left: number) => EndoOf<HTMLElement | SVGElement>;
declare const styleTop: (top: number) => EndoOf<HTMLElement | SVGElement>;
declare const absolutePosition: (top: number, left: number) => EndoOf<HTMLElement | SVGElement>;
declare const relativePosition: (top: number, left: number) => EndoOf<HTMLElement | SVGElement>;
declare const transformRight: (left: number) => EndoOf<HTMLElement | SVGElement>;
declare const transformDownRight: (top: number, left: number) => EndoOf<HTMLElement | SVGElement>;
declare const setZIndex: (n: number) => EndoOf<HTMLElement | SVGElement>;
declare const setClipPath: (clipId: string) => EndoOf<HTMLElement | SVGElement>;
declare const hideOverflow: EndoOf<HTMLElement | SVGElement>;
declare const scale: (n: number) => EndoOf<HTMLElement | SVGElement>;
declare const setBg: (s: string) => EndoOf<HTMLElement | SVGElement>;
declare const setVar: (key: string, value: string | number) => EndoOf<HTMLElement | SVGElement>;
declare const setPxVar: (key: string, value: number) => EndoOf<HTMLElement | SVGElement>;
declare const minSize: {
	width: string;
	height: string;
};
declare const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
type SetSvg<T> = Unary<T, EndoOf<SVGElement>>;
declare const svgElement: <const T extends keyof SVGElementTagNameMap>(tag: T) => SVGElementTagNameMap[T];
declare const svgAttr: Unary<string, SetSvg<string | number>>;
declare const svgAttrU: Binary<string, string | number, EndoOf<SVGElement>>;
declare const svgAttrs: SetSvg<Record<string, string | number>>;
declare const makeSvg: LazyArg<SVGSVGElement>, makeRect: LazyArg<SVGRectElement>, makeClipPath: LazyArg<SVGClipPathElement>, svgId: SetSvg<string>, svgD: SetSvg<Path>, svgX: SetSvg<number>, svgY: SetSvg<number>, svgRx: SetSvg<number>, svgRy: SetSvg<number>, svgWidth: SetSvg<number>, svgHeight: SetSvg<number>, svgRxRy: SetSvg<number>, svgLayout$1: SetSvg<VE.V4>, svgClass: SetSvg<string>;
declare const singletonSvg: (element: SVGElement) => SVGSVGElement;
declare const svgDefs: (defs: Iterable<SVGElement>) => SVGDefsElement;
declare const svgClipPath: Binary<string, Path, SVGClipPathElement>;
declare const defineClipPaths: (idToPath: Record<string, Path>) => SVGSVGElement;
declare const makePath: Unary<Path, SVGPathElement>;
declare const svgPath: Unary<Path, SVGSVGElement>;
declare const svgPathAtLength: BinaryC<number, Path, SVGSVGElement>;
declare const computeDashFor: (outlineWidth: number, dashRatio: number) => (length: number) => number;
declare const computeDash: (outlineWidth: number, dashRatio: number) => (path: SVGPathElement) => number;
declare const svgRect: {
	({ radius, hfoci, vfoci, outlineGap, outlineWidth, }: Record<"radius" | "hfoci" | "vfoci" | "outlineGap" | "outlineWidth", number>): SVGSVGElement;
	pathLength(radius: number, hfoci: number, vfoci: number): number;
};
declare const media: () => MediaQueryList;
declare const matchMedia$1: LazyArg<Theme>;
declare const setTheme: (theme: Theme) => void;
declare const getTheme: LazyArg<Theme>;
declare const onThemeChange: (handler: (theme: Theme) => void) => void;
declare const mapValues: <A, B>(f: (old: A) => B) => <K extends string>(o: Record<K, A>) => Record<K, B>;
declare const camelCaseKeys: <A>(o: Record<string, A>) => typeof o;
declare const px: (px: number) => string;
declare const pxs: <K extends string>(pxs: Record<K, number>) => Record<K, string>;
declare const monoRecord: <V>(value: V) => <KS extends readonly string[]>(keys: KS) => Record<KS[number], V>;
type Void = () => void;
type Unary<Q = never, R = unknown> = FunctionN<[
	Q
], R>;
type Binary<P, Q, R> = FunctionN<[
	P,
	Q
], R>;
type BinaryC<P, Q, R> = Unary<P, Unary<Q, R>>;
type Endo<T> = Unary<T, T>;
type EndoOf<Base> = <T extends Base>(_: T) => T;
type BinOp<T> = Binary<T, T, T>;
type BinOpC<T> = Unary<T, Endo<T>>;
type Pair<A> = [
	A,
	A
];
type Tuple3<A> = readonly [
	A,
	A,
	A
];
type Tuple4<A> = [
	A,
	A,
	A,
	A
];
type VoidConstructor<O> = new () => O;
declare const camelToDash: Endo<string>;
declare const mapTuple3: <A, B>(f: Unary<A, B>) => ([a1, a2, a3]: Tuple3<A>) => Tuple3<B>;
declare const dup: <A>(a: A) => Pair<A>;
declare const pairMapC: <A, B>(f: Unary<A, B>) => Unary<Pair<A>, Pair<B>>;
declare const modFirst: <A>(f: Endo<A>) => Endo<Pair<A>>, modSecond: <A>(f: Endo<A>) => Endo<Pair<A>>;
declare const AR: typeof EffectArray;
declare class Base extends HTMLElement {
	#private;
	constructor();
	get connected(): boolean;
	get id(): string;
	get clipId(): string;
	get clipPathStyle(): {
		clipPath: string;
	};
	getIntAttribute(name: string): number;
	getBooleanAttribute(name: string): boolean;
	toggleBooleanAttribute(name: string): this;
	getFloatAttribute(name: string): number;
	getFloatStyle(name: string): number;
	getPxStyle(name: string): number;
	setAbsolute(): this;
	setTop(n: number): this;
	setLeft(n: number): this;
	setSize(size: VE.V2): this;
	setTopLeft(topLeft: VE.V2): this;
	setPxVar(name: string, n: number): this;
	setPxVars(all: Record<string, number>): this;
	onMouseEnter(element: Element, method: LazyArg<this>): this;
	onMouseLeave(element: Element, method: LazyArg<this>): this;
	onPointerDown(element: Element, method: Unary<PointerEvent, this>): this;
	onPointerUp(element: Element, method: LazyArg<this>, action: Unary<PointerEvent, this>): this;
	onKeyDown(element: Element, method: Unary<KeyboardEvent, this>): this;
	onKeyUp(element: Element, method: Unary<KeyboardEvent, this>): this;
	protected buildChildren(): Node[];
	protected buildAttributes(): Record<string, string | number>;
	protected buildStyle(): Record<string, string | number>;
	protected syncStyle(): void;
	connectedCallback(): void;
}
interface Props {
	radius: number;
}
declare class Circle extends Base implements Props {
	get radius(): number;
	get size(): number;
	protected buildStyle(): {
		width: string;
		height: string;
		"--radius": string;
	};
}
declare const dom: ((props: Props, ...classes: string[]) => Circle) & {
	readonly tag: "x-circle";
};
interface Props$1 {
	radius: number;
	foci: number;
}
declare class RoundRect extends Base implements Props$1 {
	get radius(): number;
	get foci(): number;
	protected buildStyle(): {
		width: string;
		height: string;
		"--radius": string;
		"--foci": string;
	};
}
declare const dom$1: ((props: Props$1, ...classes: string[]) => RoundRect) & {
	readonly tag: "round-rect";
};
declare const outlineWidth = 2, dashRatio = 1.5, outlineGap: number;
declare class FocusFrame extends roundRect$1.RoundRect implements roundRect$1.Props {
	protected buildChildren(): Node[];
	protected buildStyle(): {
		"--outline": string;
		"--dash": number;
		width: string;
		height: string;
		"--radius": string;
		"--foci": string;
	};
}
declare const dom$2: ((props: roundRect$1.Props, ...classes: string[]) => FocusFrame) & {
	readonly tag: "focus-frame";
};
type Props$2 = circle$1.Props;
declare class Knob extends circle$1.Circle implements Props$2 {
	protected buildChildren(): Node[];
}
declare const dom$3: ((props: circle$1.Props, ...classes: string[]) => Knob) & {
	readonly tag: "x-knob";
};
declare class Moon extends circle$1.Circle implements circle$1.Props {
	protected buildChildren(): Node[];
	protected buildStyle(): {
		clipPath: string;
		width: string;
		height: string;
		"--radius": string;
	};
}
declare const dom$4: ((props: circle$1.Props, ...classes: string[]) => Moon) & {
	readonly tag: "x-moon";
};
interface Props$3 {
	radius: number;
	foci: number;
}
declare class MoonSun extends Base implements Props$3 {
	get radius(): number;
	get foci(): number;
	protected buildChildren(): Node[];
	protected buildStyle(): {
		width: string;
		height: string;
		"--radius": string;
		"--foci": string;
	};
}
declare const dom$5: ((props: Props$3, ...classes: string[]) => MoonSun) & {
	readonly tag: "moon-sun";
};
interface Props$4 extends circle$1.Props {
	radialWidth: number;
}
declare class Ring extends circle$1.Circle implements Props$4 {
	get radialWidth(): number;
	get maxRadialWidth(): number;
	get activeClipId(): string;
	moveCenterOf(outerSize: number): this;
	protected buildChildren(): Node[];
	protected buildStyle(): {
		width: string;
		height: string;
		"--radius": string;
		"--radialWidth": string;
		"--activeClipId": string;
		"--clipId": string;
	};
}
declare const dom$6: ((props: Props$4, ...classes: string[]) => Ring) & {
	readonly tag: "x-ring";
};
interface Props$5 extends roundRect$1.Props {
	radialWidth: number;
}
declare class RoundRectRing extends roundRect$1.RoundRect implements Props$5 {
	get radialWidth(): number;
	protected buildChildren(): Node[];
	protected buildStyle(): {
		clipPath: string;
		width: string;
		height: string;
		"--radius": string;
		"--foci": string;
		"--radialWidth": string;
	};
}
declare const dom$7: ((props: Props$5, ...classes: string[]) => RoundRectRing) & {
	readonly tag: "round-rect-ring";
};
declare class SkyMoon extends circle$1.Circle implements circle$1.Props {
	get innerRadius(): number;
	protected buildChildren(): Node[];
}
declare const dom$8: ((props: circle$1.Props, ...classes: string[]) => SkyMoon) & {
	readonly tag: "sky-moon";
};
declare class SkySun extends circle$1.Circle implements circle$1.Props {
	get innerRadius(): number;
	protected buildChildren(): Node[];
}
declare const dom$9: ((props: circle$1.Props, ...classes: string[]) => SkySun) & {
	readonly tag: "sky-sun";
};
interface Props$6 {
	innerRadius: number;
	outerRadius: number;
	frameRadialWidth: number;
	hover?: boolean;
	active?: boolean;
}
declare class ThemeToggleBase extends Base implements Props$6 {
	constructor();
	get hover(): boolean;
	get active(): boolean;
	setHover(): this;
	unsetHover(): this;
	setActive(): this;
	unsetActive(): this;
	get theme(): Theme;
	get isLight(): boolean;
	get isDark(): boolean;
	setLight(): this;
	setDark(): this;
	get innerRadius(): number;
	get outerRadius(): number;
	get frameRadialWidth(): number;
	tongueRightShift(isLight: boolean): number;
	knobRightShift(isLight: boolean): number;
	toggle(): this;
	handleKeyDown({ code }: KeyboardEvent): this;
	handleKeyUp(event: KeyboardEvent): this;
	get clipId(): string;
	protected buildAttributes(): Record<string, string | number>;
}
declare class ThemeToggle extends ThemeToggleBase {
	protected buildChildren(): Node[];
	protected buildStyle(): Record<string, string | number>;
}
declare const dom$10: ((props: Props$6, ...classes: string[]) => ThemeToggle) & {
	readonly tag: "theme-toggle";
};
interface Props$7 {
	radius: number;
	foci: number;
}
declare class Tongue extends Base implements Props$7 {
	get radius(): number;
	get foci(): number;
	protected buildChildren(): Node[];
	protected buildStyle(): {
		clipPath: string;
		width: string;
		height: string;
		"--radius": string;
		"--foci": string;
	};
}
declare const dom$11: ((props: Props$7, ...classes: string[]) => Tongue) & {
	readonly tag: "x-tongue";
};

declare namespace VE {
	export { Equivalence, LayoutKey, SvgLayoutKey, TopLeft, V2, V4, WidthHeight, XY, absFirst, absSecond, absoluteLayout, add, addC, addFirst, addSecond, build, buildC, centerInside, centerToTopLeft, circumference, distanceFromOrigin, double, doubleFirst, doubleSecond, fromFirst, fromHeight, fromLeft, fromSecond, fromTop, fromWidth, half, halfFirst, halfSecond, isZero, layout, mirror, modCenter, modSize, multiply, multiplyFirst, multiplySecond, negateFirst, negateSecond, of, pxBoth, show, square, squareAbsolute, squarePxSize, subtract, subtractC, subtractFirst, subtractSecond, svgLayout, toPxSize, toPxTopLeft, toSize, toTopLeft, toXY, unit, zero, zero4 };
}
declare namespace base {
	export { Base };
}
declare namespace circle$1 {
	export { Circle, Props, dom };
}
declare namespace focusFrame {
	export { FocusFrame, dashRatio, dom$2 as dom, outlineGap, outlineWidth };
}
declare namespace knob {
	export { Knob, Props$2 as Props, dom$3 as dom };
}
declare namespace moon$1 {
	export { Moon, dom$4 as dom };
}
declare namespace moonSun {
	export { MoonSun, Props$3 as Props, dom$5 as dom };
}
declare namespace ring {
	export { Props$4 as Props, Ring, dom$6 as dom };
}
declare namespace roundRect$1 {
	export { Props$1 as Props, RoundRect, dom$1 as dom };
}
declare namespace roundRectRing$1 {
	export { Props$5 as Props, RoundRectRing, dom$7 as dom };
}
declare namespace skyMoon {
	export { SkyMoon, dom$8 as dom };
}
declare namespace skySun {
	export { SkySun, dom$9 as dom };
}
declare namespace themeToggle {
	export { ThemeToggle, dom$10 as dom };
}
declare namespace tongue$1 {
	export { Props$7 as Props, Tongue, dom$11 as dom };
}
declare namespace dom$12 {
	export { Builder, CustomTag, FromClasses, MouseHandler, Path, PointerHandler, SVG_NAMESPACE, SetSvg, Theme, absolutePosition, absoluteSquareTopLeft, addClass, addClasses, append, appendAll, appendAllF, appendF, appendTextDiv, attr, attrC, attrs, attrsC, builderFor, circle, circleRing, computeDash, computeDashFor, defineClipPaths, defineCustom, div, element, elementC, erase, getTheme, h1, h2, h3, h4, hideOverflow, joinPath, keyDown, keyUp, makeClipPath, makePath, makeRect, makeSvg, matchMedia$1 as matchMedia, measureElement, media, minSize, moon, mouseEnter, mouseLeave, onThemeChange, pointerDown, pointerUp, prepend, prependAll, prependAllF, prependF, relativePosition, removeClass, roundRect, roundRectRing, scale, setBg, setClipPath, setPxVar, setTabIndex, setTheme, setVar, setZIndex, singletonSvg, style, styleC, styleHeight, styleLeft, styleSize, styleSquareSize, styleTop, styleWidth, styles, stylesC, svgAttr, svgAttrU, svgAttrs, svgClass, svgClipPath, svgD, svgDefs, svgElement, svgHeight, svgId, svgLayout$1 as svgLayout, svgPath, svgPathAtLength, svgRect, svgRx, svgRxRy, svgRy, svgWidth, svgX, svgY, text, textDiv, tongue, transformDownRight, transformRight, wrap };
}
declare namespace util {
	export { AR, BinOp, BinOpC, Binary, BinaryC, Builder, CustomTag, Endo, EndoOf, FromClasses, K, LazyArg, MouseHandler, NU, Pair, Path, PointerHandler, SVG_NAMESPACE, SetSvg, Theme, Tuple3, Tuple4, Unary, Void, VoidConstructor, absolutePosition, absoluteSquareTopLeft, addClass, addClasses, append, appendAll, appendAllF, appendF, appendTextDiv, apply, attr, attrC, attrs, attrsC, builderFor, camelCaseKeys, camelToDash, circle, circleRing, compose, computeDash, computeDashFor, constFalse, constNull, constTrue, constUndefined, defineClipPaths, defineCustom, div, dup, element, elementC, erase, flip, flow, getFirst, getSecond, getTheme, h1, h2, h3, h4, hideOverflow, id, joinPath, keyDown, keyUp, makeClipPath, makePath, makeRect, makeSvg, mapFirst, mapSecond, mapTuple3, mapValues, matchMedia$1 as matchMedia, measureElement, media, minSize, modFirst, modSecond, monoRecord, moon, mouseEnter, mouseLeave, omit, onThemeChange, pairMapC, pipe, pointerDown, pointerUp, prepend, prependAll, prependAllF, prependF, px, pxs, relativePosition, removeClass, roundRect, roundRectRing, scale, setBg, setClipPath, setPxVar, setTabIndex, setTheme, setVar, setZIndex, singletonSvg, style, styleC, styleHeight, styleLeft, styleSize, styleSquareSize, styleTop, styleWidth, styles, stylesC, svgAttr, svgAttrU, svgAttrs, svgClass, svgClipPath, svgD, svgDefs, svgElement, svgHeight, svgId, svgLayout$1 as svgLayout, svgPath, svgPathAtLength, svgRect, svgRx, svgRxRy, svgRy, svgWidth, svgX, svgY, text, textDiv, tongue, transformDownRight, transformRight, tupled, untupled, unzip, wrap, zip };
}

export {
	VE,
	base,
	circle$1 as circle,
	dom$12 as dom,
	focusFrame,
	knob,
	moon$1 as moon,
	moonSun,
	ring,
	roundRect$1 as roundRect,
	roundRectRing$1 as roundRectRing,
	skyMoon,
	skySun,
	themeToggle,
	tongue$1 as tongue,
	util,
};

export {};
