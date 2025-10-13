import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */
export default function MuscleBackMap({ primary = [], secondary = [] }){
    const GetFill = (id) => {
        if (primary.includes(id)) return '#002c50ff';       
        if (secondary.includes(id)) return '#008cff8c';      
        return '#7d7d7dff';
    };

    return (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={200}
        height={200}
        viewBox="0 0 500 500"
    >
        <G id="Forearms" transform="matrix(-2.18393 0 0 2.23585 491.462 -130.675)">
        <Path
            d="m76.332 158.133-1.955 12.166 3.394 11.552 1.168-11.066-2.607-12.652Z"
            style={{
            fill: GetFill("Brachialis"),
            
            strokeWidth: 1,
            }}
        />
        <Path
            d="m84.586 170.056-1.956-10.463-4.779-1.46s2.824 12.409 2.607 12.409c-.217 0-1.303 10.706-1.303 10.706l4.344-.488 1.087-10.704Z"
            style={{
            fill: GetFill("Brachialis"),
            
            strokeWidth: 1,
            }}
        />
        <Path
            d="m151.464 181.627-1.955-12.166 3.394-11.552 1.168 11.066-2.607 12.652Z"
            style={{
            fill: GetFill("Brachialis"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 151.79 169.768)"
        />
        <Path
            d="m150.597 169.101-1.956 10.463-4.779 1.46s2.824-12.409 2.607-12.409c-.217 0-1.303-10.706-1.303-10.706l4.344.488 1.087 10.704Z"
            style={{
            fill: GetFill("Brachialis"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 147.23 169.467)"
        />
        </G>
        <G id="Hands" transform="matrix(-2.50203 0 0 2.23585 527.418 -129.442)">
        <Path
            d="m86.28 182.505-5.203.852-1.041 3.917 1.338 3.407 5.501-.171 2.081-3.066-2.676-4.939Z"
            style={{
            fill: GetFill("Hands"),
            
            strokeWidth: 1,
            }}
        />
        <Path
            d="m145.272 190.681-5.203-.852-1.041-3.917 1.338-3.407 5.501.171 2.081 3.066-2.676 4.939Z"
            style={{
            fill: GetFill("Hands"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 143.488 186.593)"
        />
        </G>
        <Path
        d="M243.496 60.082h8.365l14.824 17.903 1.521 28.022-6.463 11.674-6.462 4.669-15.967.389-9.883-5.058-5.702-12.455 4.561-27.631 15.206-17.513Z"
        style={{
            fill: GetFill("Head"),
            
            strokeWidth: 1,
        }}
        transform="rotate(180 245.967 91.41)"
        ></Path>
        <G id="Trapezius" transform="matrix(1 0 0 .91559 0 9.058)">
        <Path
            shape="triangle 214.011 107.306 29.341 20.958 1 0 1@dfe37eb0"
            d="M243.352 107.306v20.958h-29.341l29.341-20.958Z"
            style={{
            fill: GetFill("Upper trapezius"),
            
            }}
        />
        <Path
            shape="triangle -274.66 107.306 29.341 20.958 1 0 1@a369a4a2"
            d="M-245.319 107.306v20.958h-29.341l29.341-20.958Z"
            style={{
            fill: GetFill("Upper trapezius"),
            
            strokeWidth: 1,
            }}
            transform="scale(-1 1)"
        />
        <Path
            shape="triangle 213.116 -246.38 30.134 116.121 1 0 1@cb309288"
            d="M243.25-246.38v116.121h-30.134L243.25-246.38Z"
            style={{
            fill: GetFill("Upper trapezius"),
            
            }}
            transform="scale(1 -1)"
        />
        <Path
            shape="triangle -275.49 -246.37 29.792 116.121 1 0 1@72663870"
            d="M-245.698-246.37v116.121h-29.792l29.792-116.121Z"
            style={{
            fill: GetFill("Upper trapezius"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180)"
        />
        </G>
        <G id="Lower back" transform="matrix(1 0 0 1.00126 0 -9.43)">
        <Path
            d="m243.41 248.092-8.857-6.927-8.565 17.176 17.079 11.272.343-21.521Z"
            style={{
            fill: GetFill("Erector spinae"),
            
            }}
        />
        <Path
            d="m263.114 262.686-8.857 6.927-8.565-17.176 17.079-11.272.343 21.521Z"
            style={{
            fill: GetFill("Erector spinae"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 254.403 255.389)"
        />
        </G>
        <G id="Latissimus"transform="matrix(1 0 0 .94405 0 7.892)">
        <Path
            d="m212.104 141.059-16.699 22.822 24.492 1.113-7.793-23.935Z"
            style={{
            fill: GetFill("Latissimus dorsi"),
            
            }}
        />
        <Path
            d="m285.297 164.994-16.699-22.822 24.492-1.113-7.793 23.935Z"
            style={{
            fill: GetFill("Latissimus dorsi"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 280.844 153.027)"
        />
        <Path
            d="m196.007 167.106 23.806 1.38 17.218 62.793-12.388 24.152-17.251.69-2.07-49.338-9.315-39.677Z"
            style={{
            fill: GetFill("Latissimus dorsi"),
            
            }}
        />
        <Path
            d="m254.461 256.121 24.282-.875 16.265-63.298-11.911-24.152-17.251-.69-2.07 49.338-9.315 39.677Z"
            style={{
            fill: GetFill("Latissimus dorsi"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 273.782 211.613)"
        />
        </G>
        <G id ="Rear deltoids" transform="matrix(-2.18393 0 0 2.23585 492.835 -129.092)">
        <Path
            d="m140.487 117.581-11.423.198 8.004 12.082 9.845-.197-6.426-12.083Z"
            style={{
            fill: GetFill("Posterior deltoid"),
            
            }}
        />
        <Path
            d="m91.974 129.861-11.423-.198 8.004-12.082 9.845.197-6.426 12.083Z"
            style={{
            fill: GetFill("Posterior deltoid"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 89.476 123.721)"
        />
        </G>
        <G id = "Triceps" transform="translate(-.25 -1.754)">
        <Path
            d="m167.781 165.383 9.66 1.134-6.829 20.51-8.892 31.041-4.547-.162 4.308-34.948 6.3-17.575ZM181.256 167.161l6.426-.528 1.515 27.17-8.31 28.734-7.663-.95 4.795-16.456 3.281-11.259 2.275-15.972-2.319-10.739Z"
            style={{
            fill: GetFill("Triceps brachii lateral head"),
            
            }}
        />
        <Path
            d="m181.01 172.659-3.049-2.835-6.299 23.109-8.39 26.49 7.261 1.463 6.381-21.247 3.829-12.748.267-14.232Z"
            style={{
            fill: GetFill("Triceps brachii lateral head"),
            
            }}
        />
        <Path
            d="m318.827 218.978 9.66-1.134-6.829-20.51-8.892-31.041-4.547.162 4.308 34.948 6.3 17.575Z"
            style={{
            fill: GetFill("Triceps brachii lateral head"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 318.353 192.635)"
        />
        <Path
            d="m304.495 222.919 6.426.528 1.515-27.17-8.31-28.734-7.663.95 4.795 16.456 3.281 11.259 2.275 15.972-2.319 10.739Z"
            style={{
            fill: GetFill("Triceps brachii lateral head"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 304.45 195.495)"
        />
        <Path
            d="m322.388 218.961-3.049 2.835-6.299-23.109-8.39-26.49 7.261-1.463 6.381 21.247 3.829 12.748.267 14.232Z"
            style={{
            fill: GetFill("Triceps brachii lateral head"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 313.519 196.265)"
        />
        </G>
        <G id="Glutes" transform="translate(1.05 -7.745)">
        <Path
            d="m202.987 262.784 13.256-5.208 25.183 13.512-1.203 18.713-23.04 17.334-16.09-7.896 1.894-36.455Z"
            style={{
            fill: GetFill("Gluteus maximus"),
            
            }}
        />
        <Path
            d="m248.597 301.927 13.256 5.208 25.183-13.512-1.203-18.713-23.04-17.334-16.09 7.896 1.894 36.455Z"
            style={{
            fill: GetFill("Gluteus maximus"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 266.87 282.355)"
        />
        </G>
        <G id="Hamstrings" transform="matrix(1 0 0 1.75257 .882 -230.633)">
        <Path
            d="m205.753 302.087 12.765 2.553 12.401-5.835-5.837 45.589-16.776-.365-2.553-41.942ZM206.847 343.665l-2.554-41.213-5.196-1.873 7.75 43.086ZM237.681 295.921l-5.106 3.259-.678 7.868-5.538 36.09 7.909-29.082 3.413-18.135Z"
            style={{
            fill: GetFill("Semitendinosus"),
            
            }}
        />
        <Path
            d="m257.561 340.792 12.765-2.553 12.401 5.835-5.837-45.589-16.776.365-2.553 41.942Z"
            style={{
            fill: GetFill("Semitendinosus"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 270.144 321.28)"
        />
        <Path
            d="m290.022 302.132-2.554 41.213-5.196 2.383 7.75-43.596Z"
            style={{
            fill: GetFill("Semitendinosus"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 285.827 322.738)"
        />
        <Path
            d="m262.121 342.818-5.106-3.259-.678-7.868-5.538-36.09 7.909 29.082 3.413 18.135Z"
            style={{
            fill: GetFill("Semitendinosus"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 256.46 319.21)"
        />
        </G>
        <G id="Calves">
        <Path
        d="m206.833 373.351 6.253 3.085 3.843-.254-.987 34.264-6.573 1.104-2.958-38.316"
        style={{
            fill: GetFill("Gastrocnemius"),
            
            strokeWidth: 1,
        }}
        />
        <Path
        d="m218.192 410.302 5.227-3.085 3.21.254.399-11.779.764-22.484-5.21 1.123-4.743 36.087"
        style={{
            fill: GetFill("Gastrocnemius"),
            
            strokeWidth: 1,
        }}
        transform="rotate(180 222.816 391.813)"
        />
        <Path
        d="m210.165 413.084 6.452-.114 6.708-1.644-2.677 23.095c1.007 0-1.992.146-4.75.27-2.067.094-4.001.175-4.007.175l-1.726-21.782Z"
        style={{
            fill: GetFill("Gastrocnemius"),
            
            strokeWidth: 1,
        }}
        />
        <Path
        d="m267.113 433.108 6.452.114 6.708 1.644-2.677-23.095c1.007 0-1.992-.146-4.75-.27-2.067-.094-4.001-.175-4.007-.175l-1.726 21.782Z"
        style={{
            fill: GetFill("Gastrocnemius"),
            
            strokeWidth: 1,
        }}
        transform="rotate(180 273.693 423.096)"
        />
        <Path
        d="m273.809 411.433 6.253-3.085 3.843.254-.987-34.264-6.573-1.104-2.958 38.316"
        style={{
            fill: GetFill("Gastrocnemius"),
            
            strokeWidth: 1,
        }}
        transform="rotate(180 278.646 392.392)"
        />
        <Path
        d="m262.878 373.324 5.227 3.085 3.21-.254.399 11.779.764 22.484-5.21-1.123-4.743-36.087"
        style={{
            fill: GetFill("Gastrocnemius"),
            
            strokeWidth: 1,
        }}
        />
        </G>
        <G id="Feet">
        <Path
        d="m220.98 437.844-13.403.744-10.425 5.957 8.191 7.447s14.893.744 15.637.744c.744 0 8.936-7.446 0-14.892Z"
        style={{
            fill: GetFill("Feet"),
            
        }}
        />
        <Path
        d="m288.16 452.736-13.403-.744-10.425-5.957 8.191-7.447s14.893-.744 15.637-.744c.744 0 8.936 7.446 0 14.892Z"
        style={{
            fill: GetFill("Feet"),
            
            strokeWidth: 1,
        }}
        transform="rotate(180 278.317 445.29)"
        />
        </G>
    </Svg>
    );
};

