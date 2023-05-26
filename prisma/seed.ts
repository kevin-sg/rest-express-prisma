import { SeedService} from '../src/services/seed.service'

(async () => {
  await SeedService.instance.insertData();
})()
