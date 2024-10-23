import 'reflect-metadata';

import type { Agent } from 'supertest';

import FileSystem from 'fs';
import Path from 'path';
import Test from 'supertest';
import { container } from 'tsyringe';

import App from '~Core/Modules/App';

describe('StorageController', () => {
  const DATA_TEST_DIR = Path.join(__dirname, 'Data');
  const BASE_URL = '/api/image';
  const IMAGE_RESOURCE_DIR = Path.join(__dirname, '../../../resources/images');
  const TEST_IMAGE_NAME = 'road';

  beforeAll(() => {
    ['road.jpg'].forEach((fileName) => {
      const testImagePath = Path.join(DATA_TEST_DIR, fileName);
      const destTestImagePath = Path.join(IMAGE_RESOURCE_DIR, fileName);
      if (FileSystem.existsSync(destTestImagePath)) {
        return;
      }

      FileSystem.copyFileSync(testImagePath, destTestImagePath);
    });
  });

  let agent: Agent;
  beforeEach(() => {
    const app = container.resolve(App);
    agent = Test(app.instance);
  });

  afterAll(() => {
    ['road.jpg'].forEach((fileName) => {
      const destTestImagePath = Path.join(IMAGE_RESOURCE_DIR, fileName);
      if (!FileSystem.existsSync(destTestImagePath)) {
        return;
      }

      FileSystem.rmSync(destTestImagePath);
    });
  });

  it('should return resized image', async () => {
    const res = await agent
      .get(`${BASE_URL}/${TEST_IMAGE_NAME}`)
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
    await agent.get(`${BASE_URL}/${TEST_IMAGE_NAME}`).expect(400);
  });
});
