import { describe, it, expect } from 'vitest';
import { polarToCartesian, proportionToAngle, distributeSeatsOnArc, degToRad } from '@/engine/arcGeometry.ts';

describe('arcGeometry', () => {
  describe('polarToCartesian', () => {
    it('should convert polar to cartesian coordinates', () => {
      const result = polarToCartesian(0, 0, 10, 0);
      expect(Math.round(result.x)).toBe(10);
      expect(Math.round(result.y)).toBe(0);
    });

    it('should handle 90 degree angle', () => {
      const result = polarToCartesian(0, 0, 10, Math.PI / 2);
      expect(Math.round(result.x)).toBe(0);
      expect(Math.round(result.y)).toBe(-10);
    });

    it('should handle offset conductor position', () => {
      const result = polarToCartesian(100, 100, 10, 0);
      expect(Math.round(result.x)).toBe(110);
      expect(Math.round(result.y)).toBe(100);
    });
  });

  describe('proportionToAngle', () => {
    it('should convert 0 proportion to start angle', () => {
      const angle = proportionToAngle(0, 180);
      expect(angle).toBeCloseTo(Math.PI, 5);
    });

    it('should convert 1 proportion to end angle', () => {
      const angle = proportionToAngle(1, 180);
      expect(angle).toBeCloseTo(0, 5);
    });

    it('should convert 0.5 proportion to midpoint', () => {
      const angle = proportionToAngle(0.5, 180);
      expect(angle).toBeCloseTo(Math.PI / 2, 5);
    });
  });

  describe('distributeSeatsOnArc', () => {
    it('should distribute seats evenly on arc', () => {
      const seats = distributeSeatsOnArc(5, 0, Math.PI);
      expect(seats).toHaveLength(5);
      
      // Check first and last positions are within range
      expect(seats[0]).toBeGreaterThan(0);
      expect(seats[4]).toBeLessThan(Math.PI);
    });

    it('should maintain equal spacing between seats', () => {
      const seats = distributeSeatsOnArc(4, 0, Math.PI);
      
      const spacing1 = seats[1] - seats[0];
      const spacing2 = seats[2] - seats[1];
      const spacing3 = seats[3] - seats[2];
      
      expect(spacing1).toBeCloseTo(spacing2, 5);
      expect(spacing2).toBeCloseTo(spacing3, 5);
    });

    it('should return empty array for 0 count', () => {
      const seats = distributeSeatsOnArc(0, 0, Math.PI);
      expect(seats).toHaveLength(0);
    });

    it('should return center angle for 1 seat', () => {
      const seats = distributeSeatsOnArc(1, 0, Math.PI);
      expect(seats).toHaveLength(1);
      expect(seats[0]).toBeCloseTo(Math.PI / 2, 5);
    });
  });

  describe('degToRad', () => {
    it('should convert 180 degrees to PI radians', () => {
      const rad = degToRad(180);
      expect(rad).toBeCloseTo(Math.PI, 5);
    });

    it('should convert 90 degrees to PI/2 radians', () => {
      const rad = degToRad(90);
      expect(rad).toBeCloseTo(Math.PI / 2, 5);
    });

    it('should convert 0 degrees to 0 radians', () => {
      const rad = degToRad(0);
      expect(rad).toBe(0);
    });
  });
});
