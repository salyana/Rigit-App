/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('payments', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('booking_id').references('id').inTable('bookings').onDelete('CASCADE');
    table.decimal('amount', 10, 2).notNullable();
    table.string('stripe_payment_id');
    table.enum('status', ['pending', 'completed', 'failed', 'refunded']).defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index('booking_id');
    table.index('stripe_payment_id');
    table.index('status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('payments');
};
