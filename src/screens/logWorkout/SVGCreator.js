import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */


export default function MuscleMap({ primary = [], secondary = [] }){
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
        <G id="Pectoralis major" transform="matrix(2.18393 0 0 2.23585 -8.18 -141.027)">
        <Path
            d="M112.866 116.908h-11.361l-9.771 13.466 21.132.084v-13.55Z"
            style={{
            fill: GetFill("Pectoralis major"),
            
            }}
        />
        <Path
            d="M135.39 130.444h-11.361l-9.771-13.466 21.132-.084v13.55Z"
            style={{
            fill: GetFill("Pectoralis major"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 124.824 123.669)"
        />
        </G>
        <G id="Pectoralis Minor" transform="matrix(2.18393 0 0 2.23585 -8.18 -141.239)">
            <Path
                d="M112.665 137.921h-10.821L92.538 132l20.127-.037v5.958Z"
                style={{
                fill: GetFill("Pectoralis minor"),
                
                strokeWidth: 1,
                }}
            />
            <Path
                d="M134.586 131.949h-10.821l-9.306 5.921 20.127.037v-5.958Z"
                style={{
                fill: GetFill("Pectoralis minor"),
                
                strokeWidth: 1,
                }}
                transform="rotate(180 124.522 134.928)"
            />
        </G>
        <G id="Anterior deltoid" transform="matrix(2.18393 0 0 2.23585 -8.677 -141.239)">
        <Path
            d="M-88.226-130.91v14.279H-99.89l11.664-14.279Z"
            style={{
            fill: GetFill("Anterior deltoid"),
            
            }}
            transform="rotate(180)"
        />
        <Path
            d="M138.901-130.91v14.279h-11.664l11.664-14.279Z"
            style={{
            fill: GetFill("Anterior deltoid"),
            
            strokeWidth: 1,
            }}
            transform="scale(1 -1)"
        />
        </G>
        <G id="Lateral deltoid" transform="matrix(2.18393 0 0 2.23585 -7.305 -141.239)">
        <Path
            d="m139.727 116.801 4.704.011 2.423 14.183-6.521.022-.606-14.216Z"
            style={{
            fill: GetFill("Lateral deltoid"),
            
            strokeWidth: 1,
            }}
        />
        <Path
            d="m77.729 130.759 4.704-.011 2.423-14.183-6.521-.022-.606 14.216Z"
            style={{
            fill: GetFill("Lateral deltoid"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 81.936 123.78)"
        />
        </G>
        <G id="Biceps" transform="matrix(2.18393 0 0 2.23585 -7.305 -141.239)">
        <Path
            d="M81.249 132.856s-8.569 23.245-8.569 23.396c0 .151 6.294 1.537 6.294 1.537l5.37-11.318 2.49-11.954-5.585-1.661ZM79.18 132.856l-8.038 22.374.653-14.119 7.385-8.255Z"
            style={{
            fill: GetFill("Biceps brachii long head"),
            
            }}
        />
        <Path
            d="M148.367 157.789s-8.569-23.245-8.569-23.396c0-.151 6.294-1.537 6.294-1.537l5.37 11.318 2.49 11.954-5.585 1.661Z"
            style={{
            fill: GetFill("Biceps brachii long head"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 146.875 145.322)"
        />
        <Path
            d="m155.49 155.23-8.038-22.374.653 14.119 7.385 8.255Z"
            style={{
            fill: GetFill("Biceps brachii long head"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 151.471 144.043)"
        />
        </G>
        <G id="Forearms" transform="matrix(2.18393 0 0 2.23585 -7.305 -141.239)">
        <Path
            d="m70.916 158.144-1.955 12.166 3.394 11.552 1.168-11.066-2.607-12.652Z"
            style={{
            fill: GetFill("Brachialis"),
            
            }}
        />
        <Path
            d="m79.171 170.067-1.956-10.463-4.779-1.46s2.824 12.409 2.607 12.409c-.217 0-1.303 10.706-1.303 10.706l4.344-.488 1.087-10.704Z"
            style={{
            fill: GetFill("Brachialis"),
            
            }}
        />
        <Path
            d="m155.316 181.862-1.955-12.166 3.394-11.552 1.168 11.066-2.607 12.652Z"
            style={{
            fill: GetFill("Brachialis"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 155.642 170.003)"
        />
        <Path
            d="m154.448 169.336-1.956 10.463-4.779 1.46s2.824-12.409 2.607-12.409c-.217 0-1.303-10.706-1.303-10.706l4.344.488 1.087 10.704Z"
            style={{
            fill: GetFill("Brachialis"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 151.08 169.701)"
        />
        </G>
        <G id="Hands" transform="matrix(2.50203 0 0 2.23585 -43.26 -140.672)">
        <Path
            d="m82.13 181.994-5.203.852-1.041 3.917 1.338 3.407 5.501-.171 2.081-3.066-2.676-4.939Z"
            style={{
            fill: GetFill("Hands"),
            
            }}
        />
        <Path
            d="m148.437 190.681-5.203-.852-1.041-3.917 1.338-3.407 5.501.171 2.081 3.066-2.676 4.939Z"
            style={{
            fill: GetFill("Hands"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 146.653 186.593)"
        />
        </G>
        <G id="Obliques" transform="matrix(2.18393 0 0 2.23585 -7.305 -141.239)">
        <Path
            d="m123.284 171.93 6.966-3.88 2.251-14.176 1.313-20.908-6.243 2.295-.241 16.516-4.046 20.153Z"
            style={{
            fill: GetFill("External obliques"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 128.596 153.348)"
        />
        <Path
            d="m92.866 134.835 6.326 3.672 2.31 12.604 1.421 22.593-5.77-2.2.253-16.351-4.54-20.318Z"
            style={{
            fill: GetFill("External obliques"),
            
            strokeWidth: 1,
            }}
        />
        </G>
        <G id = "Abdominals" transform="matrix(2.18393 0 0 2.23585 -7.305 -141.239)">
        <G id="Upper Abdominals" transform="matrix(1.12854 0 0 .8207 -14.888 24.379)">
            <Path
            d="m102.249 139.587 10.304.319-.102 10.385-8.058-.159-2.144-10.545Z"
            style={{
                fill: GetFill("Rectus abdominis"),
                
            }}
            />
            <Path
            d="M114.135 150.291c-1.024 0 8.196-.319 10.304-.319l-.102-10.385-8.06.159-2.142 10.545Z"
            style={{
                fill: GetFill("Rectus abdominis"),
                
                strokeWidth: 1,
            }}
            transform="rotate(180 119.247 144.939)"
            />
            <Path
            d="m104.128 151.736 8.425.061-.092 9.336-7.296-.143-1.037-9.254Z"
            style={{
                fill: GetFill("Rectus abdominis"),
                
                strokeWidth: 1,
            }}
            />
            <Path
            d="m114.252 161.133 8.123-.061-.092-9.336-7.299.143-.732 9.254Z"
            style={{
                fill: GetFill("Rectus abdominis"),
                
                strokeWidth: 1,
            }}
            transform="rotate(180 118.314 156.434)"
            />
        </G>
        <G id="Lower Abdominals" transform="matrix(1.12854 0 0 1 -15.425 -.293)">
            <Path
            d="m105.915 166.629 7.011.12.098 11.945-7.109-5.053v-7.012Z"
            style={{
                fill: GetFill("Rectus abdominis"),
                
            }}
            />
            <Path
            d="m114.953 177.811 7.011-.12.098-11.819-7.109 4.927v7.012Z"
            style={{
                fill: GetFill("Rectus abdominis"),
                
                strokeWidth: 1,
            }}
            transform="rotate(180 118.458 172.284)"
            />
            <Path
            d="m105.354 158.553 7.624.15-.039 6.887-6.784-.106-.801-6.931Z"
            style={{
                fill: GetFill("Rectus abdominis"),
                
                strokeWidth: 1,
            }}
            />
            <Path
            d="m116.08 165.53 7.518-.15-.084-6.887-6.787.105-.647 6.932Z"
            style={{
                fill: GetFill("Rectus abdominis"),
                
                strokeWidth: 1,
            }}
            transform="rotate(180 119.228 162.041)"
            />
        </G>
        </G>
        <G id="Abductor" transform="matrix(2.18393 0 0 2.23585 -7.305 -141.239)">
        <Path
            d="m97.75 173.472-2.363 3.306-.543 6.656 7.275-8.438-4.369-1.524Z"
            style={{
            fill: GetFill("Tensor fasciae latae"),
            
            }}
        />
        <Path
            d="M127.219 183.682c0-.016-2.363-3.63-2.363-3.306l-.543-6.656 7.275 8.438-4.369 1.524Z"
            style={{
            fill: GetFill("Tensor fasciae latae"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 127.95 178.701)"
        />
        </G>
        <G id="Adductor" transform="matrix(2.18393 0 0 2.23585 -7.305 -141.239)">
        <Path
            d="m103.89 175.668 6.979 3.573-2.204 9.002-4.775-12.575Z"
            style={{
            fill: GetFill("Adductor longus"),
            
            }}
        />
        <Path
            d="m115.042 188.393 7.382-3.966-2.204-8.609-5.178 12.575Z"
            style={{
            fill: GetFill("Adductor longus"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 118.733 182.105)"
        />
        </G>
        <G id="Quadraceps" transform="matrix(2.18393 0 0 2.57949 -7.305 -201.847)">
        <Path
            d="m102.468 176.373-7.579 8.336 3.376 23.005 6.85-.618 3.605-16.513-6.252-14.21Z"
            style={{
            fill: GetFill("Vastus lateralis"),
            
            }}
        />
        <Path
            d="m124.946 207.714-7.579-8.336 3.376-23.005 7.447 1.215 3.008 15.916-6.252 14.21Z"
            style={{
            fill: GetFill("Vastus lateralis"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 124.282 192.044)"
        />
        <Path
            d="M93.626 185.854s-.298 19.702-.298 20.001c0 .299 3.582 1.492 3.582 1.492l-3.284-21.493Z"
            style={{
            fill: GetFill("Vastus lateralis"),
            
            }}
        />
        <Path
            d="M129.662 207.621s-.298-19.702-.298-20.001c0-.299 3.582-1.492 3.582-1.492l-3.284 21.493Z"
            style={{
            fill: GetFill("Vastus lateralis"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 131.155 196.875)"
        />
        </G>
        <G id= "Knees" transform="matrix(2.27544 0 0 1.26064 -18.102 72.726)">
        <Path
            d="M96.424 208.736s5.332 0 5.259-.151c-.072-.15 1.658 4.536 1.658 4.536l-2.234 3.63-5.259.152-1.586-4.235 2.162-3.932Z"
            style={{
            fill: GetFill("Knees"),
            
            }}
        />
        <Path
            d="M125.572 216.888s5.332 0 5.259.151c-.072.15 1.658-4.536 1.658-4.536l-2.234-3.63-5.259-.152-1.586 4.235 2.162 3.932Z"
            style={{
            fill: GetFill("Knees"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 127.95 212.882)"
        />
        </G>
        <G id ="Calves" transform="matrix(2.50203 0 0 2.23585 -43.26 -140.672)">
        <Path
            d="m98.718 218.773-.001 32.503 3.869-.368.909-16.597-1.763-15.675-3.014.137Z"
            style={{
            fill: GetFill("Gastrocnemius"),
            
            }}
        />
        <Path
            d="m97.421 218.936-.001 32.444-2.22-1.832-.653-14.905 1.316-15.339 1.558-.368Z"
            style={{
            fill: GetFill("Gastrocnemius"),
            
            strokeWidth: 1,
            }}
        />
        <Path
            d="m122.843 250.365-.001-32.118 3.524.112 1.253 16.469-1.763 15.674-3.013-.137Z"
            style={{
            fill: GetFill("Gastrocnemius"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 125.23 234.622)"
        />
        <Path
            d="m128.815 219.056.315 31.928 2.562-1.336.099-14.909-1.416-15.328-1.56-.355Z"
            style={{
            fill: GetFill("Gastrocnemius"),
            
            strokeWidth: 1,
            }}
        />
        </G>
        <G id="Feet" transform="matrix(2.50203 0 0 2.23585 -43.833 -128.218)">
        <Path
            d="m135.478 257.508-5.646-.166-4.182-1.365-2.065-4.937 5.476-1.995 6.841-.365 4.346 2.298-.816 4.477-3.954 2.053Z"
            style={{
            fill: GetFill("Feet"),
            
            strokeWidth: 1,
            }}
            transform="rotate(180 131.916 253.094)"
        />
        <Path
            d="m99.292 248.68-5.646.166-4.182 1.365-2.065 4.937 5.476 1.995 6.841.365 4.346-2.298-.816-4.477-3.954-2.053Z"
            style={{
            fill: GetFill("Feet"),
            
            strokeWidth: 1,
            }}
        />
        </G>
        <G id="Trapezius" transform="matrix(2.18393 0 0 2.23585 -7.305 -141.239)">
        <Path
            d="M-104.425 107.666v7.608h-6.365l6.365-7.608Z"
            style={{
            fill: GetFill("Upper trapezius"),
            
            strokeWidth: 1,
            }}
            transform="scale(-1 1)"
        />
        <Path
            d="M103.271 109.233v6.093h-7.659l7.659-6.093Z"
            style={{
            fill: GetFill("Upper trapezius"),
            
            }}
        />
        <Path
            d="M121.368 107.666v7.608h-6.365l6.365-7.608Z"
            style={{
            fill: GetFill("Upper trapezius"),
            
            strokeWidth: 1,
            }}
        />
        <Path
            d="M-122.521 109.233v6.093h-7.659l7.659-6.093Z"
            style={{
            fill: GetFill("Upper trapezius"),
            
            strokeWidth: 1,
            }}
            transform="scale(-1 1)"
        />
        </G>
        <Path
        d="M235.718 110.592h8.365l14.824-17.903 1.521-28.022-6.463-11.674-6.462-4.669-15.967-.389-9.883 5.058-5.702 12.455 4.561 27.631 15.206 17.513Z"
        style={{
            fill: GetFill("Head"),
            
        }}
        ></Path>
    </Svg>
    );
}