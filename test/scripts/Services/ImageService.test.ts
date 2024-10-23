import 'reflect-metadata';

import assert from 'assert';
import FileSystem from 'fs';
import Path from 'path';
import { container } from 'tsyringe';

import ImageService from '~Services/ImageService';

describe('StorageController', () => {
  const DATA_TEST_DIR = Path.join(__dirname, 'Data');
  const DATA_IMAGE = Path.join(DATA_TEST_DIR, 'road.jpg');

  const TEST_IMAGE_NAME_1 = 'image-test-1';
  const TEST_IMAGE_NAME_2 = 'image-test-2';

  const IMAGE_RESOURCE_DIR = Path.join(__dirname, '../../../resources/images');

  let imageService: ImageService;
  beforeAll(() => {
    imageService = container.resolve(ImageService);
  });

  beforeEach(() => {
    [`${TEST_IMAGE_NAME_1}.jpg`, `${TEST_IMAGE_NAME_2}.jpg`].forEach((fileName) => {
      const destTestImagePath = Path.join(IMAGE_RESOURCE_DIR, fileName);
      if (FileSystem.existsSync(destTestImagePath)) {
        return;
      }

      FileSystem.copyFileSync(DATA_IMAGE, destTestImagePath);
    });
  });

  afterAll(() => {
    [`${TEST_IMAGE_NAME_1}.jpg`, `${TEST_IMAGE_NAME_2}.jpg`].forEach((fileName) => {
      const destTestImagePath = Path.join(IMAGE_RESOURCE_DIR, fileName);
      if (!FileSystem.existsSync(destTestImagePath)) {
        return;
      }

      FileSystem.rmSync(destTestImagePath);
    });
  });

  it('should get images', () => {
    const images = imageService.getImages();

    expect(images).toBeInstanceOf(Array);

    const names = new Set();
    images.forEach((image) => {
      expect(image).toHaveProperty('name');
      expect(image.name).not.toBe('');

      expect(image).toHaveProperty('path');
      expect(image.path).not.toBe('');

      expect(names.has(image.name)).toBe(false);
      names.add(image.name);
    });
  });

  it('should get image', () => {
    const image = imageService.getImage(TEST_IMAGE_NAME_2);
    expect(image).not.toBeNull();
    assert(image);

    expect(image).toHaveProperty('name');
    expect(image.name).toBe(TEST_IMAGE_NAME_2);

    expect(image).toHaveProperty('path');
    expect(image.path).not.toBe('');
  });

  it('should throw error when get images', () => {
    jest.spyOn(FileSystem, 'readdirSync').mockImplementation(() => {
      throw new Error('Test error');
    });

    expect(() => imageService.getImages()).toThrow();
  });
});
