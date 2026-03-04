/**
 * Firestore Collection: `motors`
 * Document ID: hexcode (unique IoT device identifier, e.g. "0xABCD1234")
 *
 * Schema:
 * {
 *   hexcode:          string   — unique device identifier (also the document ID)
 *   gas_level:        number   — latest gas reading from IoT; null initially
 *   current_on:       boolean  — whether the motor is running; null initially
 *   starttime:        number   — Unix ms timestamp; stores when motor was last started
 *                                (if current_on=false: prev start; if current_on=true: current start)
 *                                null initially
 *   user_conn:        string   — username of linked user (FK → users.username); null initially
 *                                IMMUTABLE: once set, cannot be changed
 *   schedules:        Array    — list of scheduled on/off events (carry-over from scheduler)
 *   motorTurnOffTime: number   — Unix ms timestamp when scheduler will auto-turn-off; null if no timer
 * }
 */

/**
 * Builds the initial motor document when a device is registered.
 * All fields except hexcode start as null/empty.
 * @param {string} hexcode
 * @returns {Object}
 */
export const buildInitialMotorDocument = (hexcode) => ({
    hexcode,
    gas_level: null,
    current_on: null,
    starttime: null,
    user_conn: null,
    schedules: [],
    motorTurnOffTime: null,
});

/**
 * Validates the hexcode used to link a motor.
 * @param {{ hexcode: any }} body
 * @returns {string|null}
 */
export const validateLinkInput = ({ hexcode }) => {
    if (!hexcode || typeof hexcode !== 'string' || hexcode.trim() === '') {
        return 'hexcode is required and must be a non-empty string.';
    }
    return null;
};

/**
 * Validates the gas level update payload (from IoT device).
 * @param {{ gas_level: any }} body
 * @returns {string|null}
 */
export const validateGasUpdateInput = ({ gas_level }) => {
    if (gas_level === undefined || gas_level === null) {
        return 'gas_level is required.';
    }
    if (typeof gas_level !== 'number') {
        return 'gas_level must be a number.';
    }
    return null;
};

/**
 * Validates the motor on/off update payload (from IoT device).
 * @param {{ motor: any }} body
 * @returns {string|null}
 */
export const validateMotorUpdateInput = ({ motor }) => {
    if (motor === undefined || motor === null) {
        return 'motor (boolean) is required.';
    }
    if (typeof motor !== 'boolean') {
        return 'motor must be a boolean (true/false).';
    }
    return null;
};
