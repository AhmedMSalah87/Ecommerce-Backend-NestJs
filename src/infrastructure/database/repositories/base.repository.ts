import {
  DeleteResult,
  HydratedDocument,
  Model,
  PipelineStage,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';

abstract class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(
    data: Partial<T> & { _id?: Types.ObjectId },
  ): Promise<HydratedDocument<T>> {
    return this.model.create(data);
  }

  async findOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOne(filter, projection, options).exec();
  }

  async find(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T>[]> {
    return this.model.find(filter, projection, options);
  }

  async findById(
    id: Types.ObjectId | string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id, projection, options).exec();
  }

  async findByIdAndUpdate(
    id: Types.ObjectId,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model
      .findByIdAndUpdate(id, update, {
        returnDocument: 'after',
        runValidators: true,
        ...options,
      })
      .exec();
  }

  async findByIdAndDelete(
    id: Types.ObjectId | string,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndDelete(id, options).exec();
  }

  async findOneAndUpdate(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model
      .findOneAndUpdate(filter, update, {
        returnDocument: 'after',
        runValidators: true,
        ...options,
      })
      .exec();
  }

  async findOneAndDelete(
    filter: QueryFilter<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOneAndDelete(filter, options).exec();
  }

  async updateOne(
    filter: QueryFilter<T> & { _id?: Types.ObjectId },
    update: UpdateQuery<T>,
  ): Promise<UpdateResult> {
    return this.model.updateOne(filter, update, {
      runValidators: true,
    });
  }

  async aggregate(pipeline: PipelineStage[]): Promise<unknown[]> {
    return this.model.aggregate(pipeline);
  }

  async deleteMany(filter: QueryFilter<T>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }
}

export default BaseRepository;
