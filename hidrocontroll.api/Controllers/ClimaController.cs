using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using hidrocontroll.Models;
using hidrocontroll.Areas.Functional;

namespace hidrocontroll.Controllers
{
    public class ClimaController : BaseController
    {

        // GET api/Clima
        public IQueryable<CAD_CLIMA> GetCAD_CLIMA()
        {
            return db.CAD_CLIMA;
        }

        // GET api/Clima/5
        [ResponseType(typeof(CAD_CLIMA))]
        public IHttpActionResult GetCAD_CLIMA(int id)
        {
            CAD_CLIMA cad_clima = db.CAD_CLIMA.Find(id);
            if (cad_clima == null)
            {
                return NotFound();
            }

            return Ok(cad_clima);
        }

        // PUT api/Clima/5
        public IHttpActionResult PutCAD_CLIMA(int id, CAD_CLIMA cad_clima)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_clima.IDC_CAD_CLIMA)
            {
                return BadRequest();
            }

            db.Entry(cad_clima).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
                fazMudancasClima(cad_clima);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_CLIMAExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Clima
        [ResponseType(typeof(CAD_CLIMA))]
        public IHttpActionResult PostCAD_CLIMA(CAD_CLIMA cad_clima)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_CLIMA.Add(cad_clima);
            db.SaveChanges();
            fazMudancasClima(cad_clima);

            return CreatedAtRoute("DefaultApi", new { id = cad_clima.IDC_CAD_CLIMA }, cad_clima);
        }

        // DELETE api/Clima/5
        [ResponseType(typeof(CAD_CLIMA))]
        public IHttpActionResult DeleteCAD_CLIMA(int id)
        {
            CAD_CLIMA cad_clima = db.CAD_CLIMA.Find(id);
            if (cad_clima == null)
            {
                return NotFound();
            }

            db.CAD_CLIMA.Remove(cad_clima);
            db.SaveChanges();
            fazMudancasClima(cad_clima);

            return Ok(cad_clima);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private void fazMudancasClima(CAD_CLIMA cad_clima)
        {
            DateTime dataAtualizacao = cad_clima.DAT_CLIMA;
            CAD_FAZENDA fazenda = db.CAD_FAZENDA.Include(f => f.CAD_CULTURA).Where(f2 => f2.IDC_CAD_FAZENDA == cad_clima.CAD_FAZENDA_IDC_CAD_FAZENDA).First();
            CAD_FASE_CULTURA faseCultura = null;
            


            foreach (CAD_CULTURA c in fazenda.CAD_CULTURA)
            {
                bool primeiro = true;
                double fimFaseMax = 0;

               
               
                foreach (CAD_FASE_CULTURA fc in db.CAD_FASE_CULTURA.Where(fc => fc.CAD_CULTURA_IDC_CAD_CULTURA == c.IDC_CAD_CULTURA))
                {

                    if (primeiro)
                    {
                        fimFaseMax = fc.NUM_FIM;
                        faseCultura = fc;
                        primeiro = false;
                    }
                    else
                    {
                        if (fimFaseMax < fc.NUM_FIM)
                        {
                            fimFaseMax = fc.NUM_FIM;
                            faseCultura = fc;
                        }
                    }
                }

                foreach (CAD_PARCELA p in db.CAD_PARCELA.Where(p => p.CAD_CULTURA_IDC_CAD_CULTURA == c.IDC_CAD_CULTURA))
                {
                    if (fimFaseMax >= DateTimeFunctional.diferencaDeDias(DateTime.Now, p.DAT_PLANTIO))
                    {
                        new ManejoController().atualizaManejo(p, dataAtualizacao);

                    }

                }

            }

        }

        private bool CAD_CLIMAExists(int id)
        {
            return db.CAD_CLIMA.Count(e => e.IDC_CAD_CLIMA == id) > 0;
        }
    }
}