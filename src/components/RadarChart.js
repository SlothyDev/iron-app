import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, Circle } from 'react-native-svg';
import { useTheme } from '../screens/ThemeProvider'

const RadarChart = ({


  size = 300,
  levels = 5, 
  labels = [],
  data = [],
  maxValue = 100,
  strokeColor = '#007AFF',
  fillColor = 'rgba(0,122,255,0.3)',
  gridColor = '#ccc',
}) => {
  const center = size / 2;
  const angleStep = (2 * Math.PI) / labels.length;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const padding = 45;
  // Convert a value at an axis to x,y coordinates
  const getPoint = (value, index, radiusScale = 1) => {
    const angle = angleStep * index - Math.PI / 2; // Start from top
    const radius = (value / maxValue) * (size / 2) * radiusScale;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  };

  // Outer grid polygons (levels)
  const gridPolygons = Array.from({ length: levels }, (_, i) => {
    const level = maxValue * ((i + 1) / levels);
    const points = labels.map((_, idx) => getPoint(level, idx, 1)).join(' ');
    return (
      <Polygon
        key={`grid-${i}`}
        points={points}
        stroke={gridColor}
        fill="none"
        strokeWidth={1}
      />
    );
  });

  // Axis lines
  const axisLines = labels.map((_, i) => {
    const end = getPoint(maxValue, i, 1).split(',');
    return (
      <Line
        key={`axis-${i}`}
        x1={center}
        y1={center}
        x2={end[0]}
        y2={end[1]}
        stroke={gridColor}
        strokeWidth={1}
      />
    );
  });

  // Labels
  const labelElements = labels.map((label, i) => {
    const end = getPoint(maxValue * 1.1, i, 1).split(','); // slightly outside grid
    return (
      <SvgText
        key={`label-${i}`}
        x={end[0]}
        y={end[1]}
        fill= {isDark ? "#fff" : "#333"}
        fontSize="12"
        textAnchor="middle"
      >
        {label}
      </SvgText>
    );
  });

  // Data polygon
  const dataPoints = labels
    .map((_, i) => getPoint(data[i] || 0, i, 1))
    .join(' ');

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`-${padding} -${padding} ${size + padding * 2} ${size + padding * 2}`}>
        {/* Concentric Grid */}
        {gridPolygons}

        {/* Axes */}
        {axisLines}

        {/* Data shape */}
        <Polygon
          points={dataPoints}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={2}
        />

        {/* Labels */}
        {labelElements}

        {/* Center point */}
        <Circle cx={center} cy={center} r={2} fill={strokeColor} />
      </Svg>
    </View>
  );
};

export default RadarChart;