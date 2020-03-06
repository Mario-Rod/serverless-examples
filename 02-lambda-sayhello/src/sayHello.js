module.exports = async (event) => {
  try {
    if (!event.name) throw new Error('Invalid Name');
    return `Hello ${event.name}`;
  } catch (error) {
    console.log({ 'event': JSON.stringify(event) });
    console.log({ 'error': error });
    throw error.message;
  }
}