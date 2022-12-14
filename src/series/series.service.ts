import { Injectable } from '@nestjs/common';
import { SelectSereisPostsDto } from 'src/dto/series/select-series-posts.dto';
import { UpdateSeriesDto } from 'src/dto/series/update-series.dto';
import { User } from 'src/entity/user.entity';
import { PostSeriesRepository } from 'src/repository/post-series.repository';
import { SeriesRepository } from 'src/repository/series.repository';

@Injectable()
export class SeriesService {
  constructor(
    private seriesRepository: SeriesRepository,
    private postSeriesRepository: PostSeriesRepository,
  ) {}

  async selectSeriesList(user_id: number) {
    const series = await this.seriesRepository.selectSeriesList(user_id);

    return series;
  }

  async createSeries(user_id: number, series_name: string) {
    await this.seriesRepository.createSeries(user_id, series_name);

    return this.selectSeriesList(user_id);
  }

  async SelectSereisPosts(series_id: number, sort: SelectSereisPostsDto, user?: User) {
    let login_user_id = -1;

    if (user != null) {
      login_user_id = user.id;
    }

    const seires_posts = await this.seriesRepository.SelectSereisPosts(
      series_id,
      sort.sort,
      login_user_id,
    );

    if (seires_posts.length == 0) return null;

    return seires_posts;
  }

  async updateSeries(series_id: number, data: UpdateSeriesDto) {
    const { sort, series_name } = data;

    await this.seriesRepository.updateSeries(series_id, series_name);

    for (let i = 0; i < sort.length; i++) {
      await this.postSeriesRepository.updatePostSeriesSort(
        series_id,
        sort[i].post_id,
        sort[i].sort,
      );
    }
  }

  async deleteSeries(series_id: number) {
    await this.seriesRepository.deleteSeries(series_id);
  }
}
