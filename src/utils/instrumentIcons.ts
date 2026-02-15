export const ICONS: Record<string, string> = {
    // === STRINGS ===
    // Violin/Viola: 8-shaped body with neck
    'violin': 'M12,2 C13.1,2 14,2.9 14,4 V10 C16,11 17,13 17,15 C17,18.3 15.3,21 12,21 C8.7,21 7,18.3 7,15 C7,13 8,11 10,10 V4 C10,2.9 10.9,2 12,2 M12,13 C11,13 10.5,14 10.5,15 C10.5,16 11,17 12,17 C13,17 13.5,16 13.5,15 C13.5,14 13,13 12,13',

    // Cello/Bass: Wider body, distinct from violin
    'cello': 'M12,2 C13.1,2 14,2.9 14,4 V9 C16.5,10 18,12.5 18,15 C18,18.5 15,22 12,22 C9,22 6,18.5 6,15 C6,12.5 7.5,10 10,9 V4 C10,2.9 10.9,2 12,2 M12,12 C10.5,12 9.5,13.5 9.5,15 C9.5,16.5 10.5,18 12,18 C13.5,18 14.5,16.5 14.5,15 C14.5,13.5 13.5,12 12,12',

    // Harp: Triangle frame
    'harp': 'M7,2 H9 L18,2 V22 H14 L14,4 H13 V22 H11 L11,5 H7 V2 Z M8,6 V20 L10,18 V6 H8',

    // === WOODWINDS ===
    // Flute: Thin tube held horizontally (or vertical for icon fit) - Vertical with keys
    'flute': 'M11,2 H13 V22 H11 V2 Z M12,4 A0.5,0.5 0 1,1 12,5 A0.5,0.5 0 0,1 12,4 M12,7 A0.5,0.5 0 1,1 12,8 M12,10 A0.5,0.5 0 1,1 12,11 M12,13 A0.5,0.5 0 1,1 12,14',

    // Clarinet/Oboe/Bassoon: Tube with bell at bottom
    'single-reed': 'M11,2 H13 V18 L15,22 H9 L11,18 V2 Z M12,5 H13 M11,8 H13 M11,11 H13',

    // Double reeds (Oboe/Bassoon) - represented similar to single reed but thinner/different
    'double-reed': 'M11.5,2 H12.5 V18 L14,22 H10 L11.5,18 V2 Z',

    // Saxophone: J-shape
    'saxophone': 'M14,2 H16 V14 C16,17 14,19 11,19 H9 L7,17 L8,16 L10,18 H11 C13,18 14,17 14,15 V2',

    // === BRASS ===
    // Trumpet: Horizontal tube with flare and valves
    'trumpet': 'M4,9 L6,9 L8,7 L16,7 L20,4 V14 L16,11 L8,11 L6,9 L4,9 V8 Z M10,7 V5 M12,7 V5 M14,7 V5',

    // Horn: Circular/Coil
    'horn': 'M12,4 A8,8 0 1,1 4,12 A8,8 0 0,1 12,4 M12,7 A5,5 0 1,0 7,12 A5,5 0 0,0 12,7 M18,4 L22,0 M4,12 L0,12',

    // Trombone: Slide geometry
    'trombone': 'M2,8 H14 L20,4 V12 L14,8 H2 V8 M8,8 V16 H14 V8',

    // Tuba: Large upright with bell
    'tuba': 'M8,2 H16 L20,6 V18 C20,20 18,22 16,22 H8 C6,22 4,20 4,18 V6 L8,2 M12,8 V16',

    // === PERCUSSION ===
    // Drum (Timpani/Snare)
    'drum': 'M4,6 H20 V16 C20,18 18,20 12,20 C6,20 4,18 4,16 V6 M4,6 C4,4 7,2 12,2 C17,2 20,4 20,6',

    // Mallet (Xylophone)
    'mallet': 'M4,12 L8,8 M16,8 L20,12 M6,10 L18,10',

    // Cymbals
    'cymbals': 'M7,12 A5,5 0 1,0 17,12 M12,12 L18,6',

    // === KEYBOARD ===
    // Piano keys
    'keyboard': 'M2,6 H22 V18 H2 V6 M6,6 V12 M10,6 V12 M14,6 V12 M18,6 V12',

    // Fallback
    'note': 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
};

export const INSTRUMENT_ICON_MAP: Record<string, string> = {
    // String family
    'violin-1': 'violin',
    'violin-2': 'violin',
    'viola': 'violin',
    'cello': 'cello',
    'double-bass': 'cello',
    'harp': 'harp',

    // Woodwinds
    'flute': 'flute',
    'piccolo': 'flute',
    'oboe': 'double-reed',
    'english-horn': 'double-reed',
    'clarinet': 'single-reed',
    'bass-clarinet': 'single-reed',
    'bassoon': 'double-reed',
    'contrabassoon': 'double-reed',
    'saxophone': 'saxophone',

    // Brass
    'french-horn': 'horn',
    'trumpet': 'trumpet',
    'cornet': 'trumpet',
    'trombone': 'trombone',
    'bass-trombone': 'trombone',
    'tuba': 'tuba',
    'euphonium': 'tuba',

    // Percussion
    'timpani': 'drum',
    'snare-drum': 'drum',
    'bass-drum': 'drum',
    'cymbals': 'cymbals',
    'xylophone': 'mallet',
    'marimba': 'mallet',
    'glockenspiel': 'mallet',
    'chimes': 'mallet',
    'percussion': 'drum',

    // Keyboard
    'piano': 'keyboard',
    'celeste': 'keyboard',
    'organ': 'keyboard',
};

export function getInstrumentIcon(instrumentId: string): string {
    const iconKey = INSTRUMENT_ICON_MAP[instrumentId];
    return ICONS[iconKey] || ICONS['note'];
}
