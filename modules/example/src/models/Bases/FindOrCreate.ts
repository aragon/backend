import { DocumentType, ModelOptions } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { FilterQuery } from "mongoose";

/**
 * Result for the `findOrCreate` function
 */
export interface FindOrCreateResult<T> {
  created: boolean;
  doc: DocumentType<T>;
}

/**
 * Implements the FindOrCreate functionality and extends Timestamps from typegoose.
 * This is necessary because in TS we cannot extend multiple classes.
 *
 * @export
 * @abstract
 * @class FindOrCreateTimestamps
 * @extends {TimeStamps}
 */
@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export abstract class FindOrCreateTimestamps extends TimeStamps {
  /**
   * Tries to fetch a document. If not found it creates it with the given condition as fields.
   *
   * @static
   * @template T
   * @param {ModelType<T>} this
   * @param {T} condition
   * @return {*}  {Promise<FindOrCreateResult<T>>}
   * @memberof FindOrCreate
   */
  public static async findOrCreateWithResult<T extends FindOrCreate>(
    this: ModelType<T>,
    condition: T
  ): Promise<FindOrCreateResult<T>> {
    return FindOrCreateTimestamps._findOrCreateWithResult<T>(this, condition);
  }

  /**
   * Tries to fetch a document. If not found it creates it with the given condition as fields.
   * It returns only the document and not if it got created or not
   *
   * @static
   * @template T
   * @param {ModelType<T>} this
   * @param {T} condition
   * @return {*}  {Promise<DocumentType<T>>}
   * @memberof FindOrCreate
   */
  public static async findOrCreate<T extends FindOrCreate>(
    this: ModelType<T>,
    condition: T
  ): Promise<DocumentType<T>> {
    const result = await FindOrCreateTimestamps._findOrCreateWithResult<T>(
      this,
      condition
    );
    return result.doc;
  }

  /**
   * Tries to fetch a document. If not found it creates it with the given condition as fields.
   *
   * @private
   * @static
   * @template T
   * @param {ModelType<T>} model
   * @param {T} condition
   * @return {*}  {Promise<FindOrCreateResult<T>>}
   * @memberof FindOrCreate
   */
  private static async _findOrCreateWithResult<T>(
    model: ModelType<T>,
    condition: FilterQuery<T>
  ): Promise<FindOrCreateResult<T>> {
    const found = await model.findOne<DocumentType<T>>(condition).exec();
    if (found) {
      return {
        created: false,
        doc: found,
      };
    }
    const created = await model.create(condition);
    return {
      created: true,
      doc: created as DocumentType<T>,
    };
  }
}

/**
 * Implements the FindOrCreate functionality and extends Timestamps from typegoose.
 *
 * @export
 * @abstract
 * @class FindOrCreate
 */
export abstract class FindOrCreate {
  /**
   * Tries to fetch a document. If not found it creates it with the given condition as fields.
   *
   * @static
   * @template T
   * @param {ModelType<T>} this
   * @param {Partial<T>} condition
   * @return {*}  {Promise<FindOrCreateResult<T>>}
   * @memberof FindOrCreate
   */
  public static async findOrCreateWithResult<T extends FindOrCreate>(
    this: ModelType<T>,
    condition: Partial<T>
  ): Promise<FindOrCreateResult<T>> {
    return FindOrCreate._findOrCreateWithResult<T>(this, condition);
  }

  /**
   * Tries to fetch a document. If not found it creates it with the given condition as fields.
   * It returns only the document and not if it got created or not
   *
   * @static
   * @template T
   * @param {ModelType<T>} this
   * @param {Partial<T>} condition
   * @return {*}  {Promise<DocumentType<T>>}
   * @memberof FindOrCreate
   */
  public static async findOrCreate<T extends FindOrCreate>(
    this: ModelType<T>,
    condition: Partial<T>
  ): Promise<DocumentType<T>> {
    const result = await FindOrCreate._findOrCreateWithResult<T>(
      this,
      condition
    );
    return result.doc;
  }

  /**
   * Tries to fetch a document. If not found it creates it with the given condition as fields.
   *
   * @private
   * @static
   * @template T
   * @param {ModelType<T>} model
   * @param {T} condition
   * @return {*}  {Promise<FindOrCreateResult<T>>}
   * @memberof FindOrCreate
   */
  private static async _findOrCreateWithResult<T>(
    model: ModelType<T>,
    condition: FilterQuery<T>
  ): Promise<FindOrCreateResult<T>> {
    const found = await model.findOne<DocumentType<T>>(condition).exec();
    if (found) {
      return {
        created: false,
        doc: found,
      };
    }
    const created = await model.create(condition);
    return {
      created: true,
      doc: created as DocumentType<T>,
    };
  }
}
