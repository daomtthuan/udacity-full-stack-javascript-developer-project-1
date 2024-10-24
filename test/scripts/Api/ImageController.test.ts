import 'reflect-metadata';

import type { Agent } from 'supertest';

import FileSystem from 'fs';
import Path from 'path';
import Test from 'supertest';
import { container } from 'tsyringe';

import App from '~Core/Modules/App';

describe('StorageController', () => {
  const DATA_TEST_DIR = Path.join(__dirname, 'Data');
  const DATA_IMAGE = Path.join(DATA_TEST_DIR, 'road.jpg');

  const TEST_IMAGE_NAME_1 = 'image-test-1';
  const TEST_IMAGE_NAME_2 = 'image-test-2';

  const BASE_URL = '/api/image';
  const IMAGE_RESOURCE_DIR = Path.join(__dirname, '../../../resources/images');

  let agent: Agent;
  beforeAll(() => {
    const app = container.resolve(App);
    agent = Test(app.instance);
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

  it('should return resized image', async () => {
    const res = await agent
      .get(`${BASE_URL}/${TEST_IMAGE_NAME_1}`)
      .query({
        width: 100,
        height: 100,
      })
      .expect(200);

    expect(res.body).toBeInstanceOf(Buffer);
  });

  it('should return 404 if image not found', async () => {
    await agent
      .get(`${BASE_URL}/NOT_EXIST_NAME`)
      .query({
        width: 100,
        height: 100,
      })
      .expect(404);
  });

  it('should return 400 for invalid request', async () => {
    await agent.get(`${BASE_URL}/${TEST_IMAGE_NAME_1}`).expect(400);
  });
});
