const { parseMultipartData, sanitizeEntity } = require('strapi-utils')

module.exports = {
  async findOne(ctx) {
    const { slug } = ctx.params
    const drop = await strapi.services.drop.findOne({ slug })
    let entity
    if (!drop) return
    if (
      (drop.maxclicks && drop.maxclicks <= drop.clicks) ||
      (drop.expiration && drop.expiration < Date.now())
    ) {
      entity = await strapi.services.drop.delete({ slug })
      return
    } else {
      entity = await strapi.services.drop.update(
        { slug },
        { clicks: drop.clicks + 1 }
      )
    }

    return sanitizeEntity(entity, { model: strapi.models.drop })
  },

  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity
    //     if (ctx.state.user) {
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx)
      data.author = ctx.state.user.id
      entity = await strapi.services.drop.create(data, { files })
    } else {
      ctx.request.body.author = ctx.state.user.id
      entity = await strapi.services.drop.create(ctx.request.body)
    }
    //     }
    return sanitizeEntity(entity, { model: strapi.models.drop })
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { slug } = ctx.params

    let entity

    const [drop] = await strapi.services.drop.find({
      slug: ctx.params.slug,
      'author.id': ctx.state.user.id
    })

    if (!drop) {
      return ctx.unauthorized(`You can't update this entry`)
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx)
      entity = await strapi.services.drop.update({ slug }, data, {
        files
      })
    } else {
      entity = await strapi.services.drop.update({ slug }, ctx.request.body)
    }

    return sanitizeEntity(entity, { model: strapi.models.drop })
  },

  async delete(ctx) {
    const { slug } = ctx.params

    let entity

    const [drop] = await strapi.services.drop.find({
      slug: ctx.params.slug,
      'author.id': ctx.state.user.id
    })

    if (!drop) {
      return ctx.unauthorized(`You can't delete this entry`)
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx)
      entity = await strapi.services.drop.delete({ slug }, data, {
        files
      })
    } else {
      entity = await strapi.services.drop.delete({ slug }, ctx.request.body)
    }

    return sanitizeEntity(entity, { model: strapi.models.drop })
  }
}
