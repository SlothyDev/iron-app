function formatSecondsToTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Pad with leading zeros if necessary
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}


export function calculateWorkoutStats(workout) {
  let totalVolume = 0;
  let totalSets = 0;

  workout.exercises.forEach(exercise => {
    exercise.sets.forEach(set => {
      const weight = !isNaN(parseFloat(set.weight)) ? parseFloat(set.weight) : 0;
      if (exercise.type === 'reps') {
        totalVolume += weight * (set.reps || 0);
      } 

      totalSets += 1;
    });
  });

  return {
    totalVolume: Math.round(totalVolume)/1000,
    totalTime: formatSecondsToTime(Math.round(workout.elapsed)),
    exerciseCount: workout.exercises.length,
    totalSets
  };
}



export function calculateMuscleHighlights(workout) {
  const primary = new Set();
  const secondary = new Set();
  workout.exercises.forEach(exercise => {
    (exercise.primary || []).forEach(muscle => primary.add(muscle));
    (exercise.secondary || []).forEach(muscle => {
      if (!primary.has(muscle)) secondary.add(muscle);
    });
  });

  return {
    primary: Array.from(primary),
    secondary: Array.from(secondary)
  };
}

const MUSCLE_GROUPS = [
  'chest',
  'back',
  'legs',
  'arms',
  'shoulders'
];

export function calculateRadarData(workout) {
  const groupTotals = {};
  MUSCLE_GROUPS.forEach(g => (groupTotals[g] = 0));

  workout.exercises.forEach(exercise => {
    // Calculate total volume for this exercise
    const volume = exercise.sets.reduce((acc, s) => {
      const weight = !isNaN(parseFloat(s.weight)) ? parseFloat(s.weight) : 0;
      return acc + (exercise.type === 'reps' ? weight * (s.reps || 0) : 0);
    }, 0);
    
    // Add full volume for all primary muscles
    (exercise.primary || []).forEach(muscle => {
      const group = mapMuscleToGroup([muscle]);
      if (group) groupTotals[group] += volume;
    });

    // Add *half* volume for all secondary muscles
    (exercise.secondary || []).forEach(muscle => {
      const group = mapMuscleToGroup([muscle]);
      if (group) groupTotals[group] += volume * 0.5;
    });
  });

  const max = Math.max(...Object.values(groupTotals), 1);

  return MUSCLE_GROUPS.map(g => ({
    group: g,
    value: groupTotals[g] / max
  }));
}

function mapMuscleToGroup(muscles = []) {
  if (!muscles.length) return null;
  const m = muscles[0].toLowerCase();
  if (m.includes('pectoralis')) return 'chest';
  if (m.includes('latissimus') || m.includes('trapezius') || m.includes('erector')) return 'back';
  if (m.includes('vastus') || m.includes('rectus') || m.includes('semitendinosus') || m.includes('gluteus')) return 'legs';
  if (m.includes('biceps') || m.includes('triceps') || m.includes('brachialis')) return 'arms';
  if (m.includes('deltoid') || m.includes('shoulder')) return 'shoulders';
  return null;
}